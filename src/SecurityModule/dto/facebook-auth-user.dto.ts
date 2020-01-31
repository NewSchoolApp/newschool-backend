import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FacebookAuthUserDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  email: string;
}
