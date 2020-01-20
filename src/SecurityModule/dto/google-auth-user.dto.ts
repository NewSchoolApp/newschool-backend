import { ApiModelProperty } from '@nestjs/swagger';

export class GoogleAuthUserDTO {
  @ApiModelProperty({ type: String })
  email: string;
  @ApiModelProperty({ type: String })
  email_verified: boolean;
  @ApiModelProperty({ type: String })
  family_name: string;
  @ApiModelProperty({ type: String })
  given_name: string;
  @ApiModelProperty({ type: String })
  locale: string;
  @ApiModelProperty({ type: String })
  name: string;
  @ApiModelProperty({ type: String })
  picture: string;
  @ApiModelProperty({ type: String })
  sub: string;
}
