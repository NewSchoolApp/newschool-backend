import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FacebookAuthUserDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  birthday: string;
  @ApiModelProperty({ type: String })
  @IsString()
  email: string;
  @ApiModelProperty({ type: String })
  @IsString()
  id: string;
  @ApiModelProperty({ type: String })
  @IsString()
  name: string;
}
