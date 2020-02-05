import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
}
