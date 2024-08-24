import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    const user = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    return this.authService.login(user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req) {
    return req.user;
  }
}
