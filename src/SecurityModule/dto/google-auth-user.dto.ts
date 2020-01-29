import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthUserDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  email: string;
}
