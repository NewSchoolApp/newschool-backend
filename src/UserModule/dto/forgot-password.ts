import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  email: string;
}
