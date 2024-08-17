import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from '../types/users';
import { AuthGuard } from '../conception/guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('pageNumber', ParseIntPipe) pageNumber: number): IUser[] {
    console.log(`User controller, pageNumber: ${pageNumber}`);
    return this.usersService.findAll();
  }
}
