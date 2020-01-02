import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordRequestIdDTO {
  @ApiModelProperty()
  id: string;
}
