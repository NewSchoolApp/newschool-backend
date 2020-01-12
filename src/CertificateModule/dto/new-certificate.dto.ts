import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewCertificateDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  title: string;

  @ApiModelProperty({ type: String })
  @IsString()
  text: string;

  @ApiModelProperty({ type: String })
  @IsString()
  certificateBackgroundName: string;
}
