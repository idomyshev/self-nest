import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class IdParamDto {
  @IsUUID()
  id: string;
}

export class FileTypeParamDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  token: string;
}

export class ClientCreateDto {
  @IsString()
  @Length(1, 50)
  name: string;
}

export class TimeSlotCreateDto {
  @IsNotEmpty()
  @IsInt()
  @Min(20240000)
  @Max(30000000)
  date?: number;

  @IsString()
  @Length(8)
  time: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsUUID()
  @IsOptional()
  clientId: string;
}

export class FileCreateDto {
  @IsNotEmpty()
  @IsString()
  data: string;
}

export class ConfirmEmailDto {
  @IsEmail()
  email: string;
  @Length(6, 6)
  regCode: string;
}

export class ChangePasswordDto {
  @IsEmail()
  email: string;
  @IsUUID()
  rpCode: string;
  @IsStrongPassword()
  password: string;
  @Length(1, 2048)
  token: string;
}

export class RestorePasswordDto {
  @IsEmail()
  email: string;
  @Length(1, 2048)
  token: string;
}

export class WordCreateDto {
  @IsString()
  @Length(1, 200)
  title: string;
}
