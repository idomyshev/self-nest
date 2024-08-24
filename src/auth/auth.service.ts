import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
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
}
