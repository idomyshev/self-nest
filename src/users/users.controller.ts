import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../conception/guard';
import { LoggingInterceptor } from '../conception/interceptor';
import { User } from '@prisma/client';
import { IdParamDto } from '../dto/users.dto';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Query('pageNumber', ParseIntPipe) pageNumber: number) {
    console.log(`User controller, pageNumber: ${pageNumber}`);
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param() params: IdParamDto) {
    console.log(`User, id: ${params.id}`);
    return await this.usersService.findOne(params.id);
  }
}
