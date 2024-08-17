import { Injectable } from '@nestjs/common';
import { IUser } from '../types/users';

@Injectable()
export class UsersService {
  findAll(): IUser[] {
    return [{ email: 'iadomyshev@gmail.com' }];
  }
}
