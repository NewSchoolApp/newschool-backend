import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ContactUsDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  cellphone: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Expose()
  email: string;
}
