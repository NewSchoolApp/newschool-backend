import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewCertificateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  text: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  certificateBackgroundName: string;
}
