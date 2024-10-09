import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID()
  id: string;
}

export class FileTypeParamDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
