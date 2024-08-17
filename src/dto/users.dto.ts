import { IsEmail, IsString } from 'class-validator';

export class UsersCreateDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
}

export type TUsersUpdateDto = Partial<UsersCreateDto>;
