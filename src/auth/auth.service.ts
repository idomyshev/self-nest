import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      email,
    });

    if (user && (await bcrypt.compare(pass, user.hash))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      jwt: await this.jwtService.signAsync(payload),
    };
  }

  async checkCaptcha(token) {
    const formData = new FormData();

    formData.append(
      'secret',
      this.configService.get<string>('CLOUDFLARE_TURNSTILE_SECRET_KEY'),
    );

    formData.append('response', token);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json();

    return !!outcome.success;
  }
}
