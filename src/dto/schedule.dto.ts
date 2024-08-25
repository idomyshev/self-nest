import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
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
