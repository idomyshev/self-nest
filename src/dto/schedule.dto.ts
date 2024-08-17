import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

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
  comment: string;
  @IsUUID()
  @IsOptional()
  clientId: string;
}
