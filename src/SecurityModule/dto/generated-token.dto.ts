import { ApiModelProperty } from '@nestjs/swagger';

export class GeneratedTokenDTO {
  @ApiModelProperty()
  accessToken: string;
  @ApiModelProperty()
  refreshToken: string;
  @ApiModelProperty()
  tokenType: string;
  @ApiModelProperty()
  expiresIn: string;
}
