import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthUserDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  email: string;

  @ApiModelProperty({ type: String })
  @IsString()
  email_verified: boolean;

  @ApiModelProperty({ type: String })
  @IsString()
  family_name: string;

  @ApiModelProperty({ type: String })
  @IsString()
  given_name: string;

  @ApiModelProperty({ type: String })
  @IsString()
  locale: string;

  @ApiModelProperty({ type: String })
  @IsString()
  name: string;

  @ApiModelProperty({ type: String })
  @IsString()
  picture: string;

  @ApiModelProperty({ type: String })
  @IsString()
  sub: string;
}
