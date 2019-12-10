import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
  @ApiModelProperty({ type: String })
  password: string;
  @ApiModelProperty({ type: String })
  validatePassword: string;
  @ApiModelProperty({ type: String })
  newPassword: string;
}
