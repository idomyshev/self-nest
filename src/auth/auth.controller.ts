import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { LoginDto, RegisterDto } from '../dto/schedule.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req) {
    return req.user;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    const user = await this.authService.validateUser(email, password);

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { email, password, token } = body;

    if (!(await this.authService.checkCaptcha(token))) {
      throw new UnprocessableEntityException({
        errors: [
          {
            path: 'token',
            customMessage: 'Captcha was not verified',
          },
        ],
      });
    }

    const salt = bcrypt.genSaltSync(
      Number(this.configService.get<string>('BCRYPT_ROUND_NUMBER')),
    );

    const hash = bcrypt.hashSync(password, salt);

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new UnprocessableEntityException({
        errors: [
          {
            path: 'email',
            customMessage: 'User with the same email already exists',
          },
        ],
      });
    }

    const regCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.create({
      data: {
        firstName: '', // TODO Do more beutiful.
        lastName: '', // TODO Do more beutiful.
        hash,
        username: '', // TODO Do more beutiful.
        email,
        regCode,
        regCodeTime: new Date(),
        active: false,
      },
    });

    const domainName = this.configService.get<string>('MAILJET_DOMAIN_NAME');

    try {
      await this.emailService.send(
        {
          email: this.configService.get<string>('MAILJET_EMAIL_FROM'),
          name: this.configService.get<string>('MAILJET_EMAIL_FROM_NAME'),
        },
        { email },
        'Confirm Your Email',
        '<h4>Dear customer!</h4>' +
          `We are very happy that you are registered on our application <a href="http://${domainName}">Self-Platform.es</a>!` +
          `<br/><br/>To confirm your email, please click <a href="http://${domainName}/login?email=${email}&regCode=${regCode}">this link</a>`,
      );

      return { created: true };
    } catch (err) {
      console.log('MAILJET SEND ERROR', err);

      throw new InternalServerErrorException({
        errors: ['Email confirmation code was not sent'],
      });
    }
  }
}
