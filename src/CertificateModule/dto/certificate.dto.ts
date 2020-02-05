import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CertificateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

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
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  certificateBackgroundName: string;
}
