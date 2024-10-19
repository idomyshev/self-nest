import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  LoginDto,
  RegisterDto,
  RestorePasswordDto,
} from '../dto/misc.dto';
import { v4 as uuidv4 } from 'uuid';

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
        username: email,
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
      console.error('Mailjet confirm email error:', err);

      throw new InternalServerErrorException({
        errors: ['Email confirmation code was not sent'],
      });
    }
  }

  @Post('confirm-email')
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
        regCode: body.regCode,
        active: false,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { active: true, regCode: null },
    });

    return { success: true };
  }

  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto) {
    const { email, password, rpCode, token } = body;

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

    await this.prisma.user.update({
      where: { email, rpCode },
      data: { rpCode: null, rpCodeTime: null, hash },
    });

    return { success: true };
  }

  @Post('restore-password')
  async restorePassword(@Body() body: RestorePasswordDto) {
    const { email, token } = body;

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

    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        active: true,
      },
    });

    if (!user) {
      // We never say to client that this email was not found for security reasons.
      return { success: true };
    }

    const rpCode = uuidv4();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { rpCode, rpCodeTime: new Date() },
    });

    const domainName = this.configService.get<string>('MAILJET_DOMAIN_NAME');

    try {
      await this.emailService.send(
        {
          email: this.configService.get<string>('MAILJET_EMAIL_FROM'),
          name: this.configService.get<string>('MAILJET_EMAIL_FROM_NAME'),
        },
        { email },
        'Restore Password',
        '<h4>Dear customer!</h4>' +
          'We got request to restore your password.' +
          `<br/><br/>Please, follow <a href="http://${domainName}/changePassword?email=${email}&rpCode=${rpCode}">this link</a> to change your current password` +
          '<br /><br/>Thanks a lot and hope to see you soon!',
      );

      return { success: true };
    } catch (err) {
      console.error('Restore password code was not sent error:', err);

      throw new InternalServerErrorException({
        errors: ['Restore password code was not sent'],
      });
    }
  }
}
