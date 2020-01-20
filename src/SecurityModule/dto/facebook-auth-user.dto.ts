import { ApiModelProperty } from '@nestjs/swagger';

export class FacebookAuthUserDTO {
  @ApiModelProperty({ type: String })
  birthday: string;
  @ApiModelProperty({ type: String })
  email: string;
  @ApiModelProperty({ type: String })
  id: string;
  @ApiModelProperty({ type: String })
  name: string;
}
