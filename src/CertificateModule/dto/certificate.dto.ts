import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CertificateDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  id: string;
  @ApiModelProperty({ type: String })
  @Expose()
  title: string;
  @ApiModelProperty({ type: String })
  @Expose()
  text: string;
  @ApiModelProperty({ type: String })
  @Expose()
  userName: string;
  @ApiModelProperty({ type: String })
  @Expose()
  certificateBackgroundName: string;
}
