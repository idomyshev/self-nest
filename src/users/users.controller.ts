import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggingInterceptor } from '../conception/interceptor';
import { IdParamDto } from '../dto/misc.dto';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param() params: IdParamDto) {
    return await this.usersService.findOne({ id: params.id }, ['hash']);
  }
}
