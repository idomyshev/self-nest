import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../conception/guard';
import { LoggingInterceptor } from '../conception/interceptor';
import { IdParamDto } from '../dto/misc.dto';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param() params: IdParamDto) {
    return await this.usersService.findOne(params.id);
  }
}
