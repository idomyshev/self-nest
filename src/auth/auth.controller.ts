import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    const user = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    return this.authService.login(user);
  }
}