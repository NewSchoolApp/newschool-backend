import { ApiModelProperty } from '@nestjs/swagger';
import { Certificate } from '../entity';
import { User } from '../../UserModule/entity';
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
}
