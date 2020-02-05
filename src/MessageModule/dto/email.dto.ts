import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class EmailDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @IsOptional()
  @IsString()
  @Expose()
  message?: string;
}
