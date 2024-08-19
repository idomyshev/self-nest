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
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param() params: IdParamDto) {
    return await this.usersService.findOne(params.id);
  }
}
