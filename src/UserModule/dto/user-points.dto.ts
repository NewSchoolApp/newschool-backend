import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UserPointsDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  points: number;
}
