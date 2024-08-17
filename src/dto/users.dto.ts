import { IsEmail, IsString, IsUUID } from 'class-validator';

// TODO from https://www.youtube.com/watch?v=gqC0IZVAlsk
// export class UsersCreateDto {
//   @IsString()
//   name: string;
//   @IsEmail()
//   email: string;
// }
//
// export type TUsersUpdateDto = Partial<UsersCreateDto>;

export class IdParamDto {
  @IsUUID()
  id: string;
}
