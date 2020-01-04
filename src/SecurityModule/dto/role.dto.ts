import { RoleEnum } from '../enum';
import { Expose } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class RoleDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  id: string;

  @ApiModelProperty({ enum: RoleEnum })
  @Expose()
  name: RoleEnum;
}
