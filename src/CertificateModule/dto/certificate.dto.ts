import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CertificateDTO {
  @ApiProperty({ type: String })
  @Expose()
  id: string;
  @ApiProperty({ type: String })
  @Expose()
  title: string;
  @ApiProperty({ type: String })
  @Expose()
  text: string;
  @ApiProperty({ type: String })
  @Expose()
  userName: string;
  @ApiProperty({ type: String })
  @Expose()
  certificateBackgroundName: string;
}
