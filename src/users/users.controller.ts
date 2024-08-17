import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from '../types/users';
import { AuthGuard } from '../conception/guard';
import { LoggingInterceptor } from '../conception/interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('pageNumber', ParseIntPipe) pageNumber: number) {
    console.log(`User controller, pageNumber: ${pageNumber}`);
    return this.usersService.findAll();
  }
}
