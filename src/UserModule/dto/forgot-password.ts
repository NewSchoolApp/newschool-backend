import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  email: string;
}
