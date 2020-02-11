import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ContactUsDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  cellphone: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;

  @IsOptional()
  @IsString()
  @Expose()
  email?: string;
}
