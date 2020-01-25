import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FacebookAuthUserDTO {
  @ApiProperty({ type: String })
  @IsString()
  birthday: string;
  @ApiProperty({ type: String })
  @IsString()
  email: string;
  @ApiProperty({ type: String })
  @IsString()
  id: string;
  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
