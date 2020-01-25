import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthUserDTO {
  @ApiProperty({ type: String })
  @IsString()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  email_verified: boolean;

  @ApiProperty({ type: String })
  @IsString()
  family_name: string;

  @ApiProperty({ type: String })
  @IsString()
  given_name: string;

  @ApiProperty({ type: String })
  @IsString()
  locale: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  picture: string;

  @ApiProperty({ type: String })
  @IsString()
  sub: string;
}
