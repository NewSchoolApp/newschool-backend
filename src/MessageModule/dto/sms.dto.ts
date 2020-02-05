import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SMSDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  phone: string;

  @IsNotEmpty()
  @Expose()
  message?: string;
}
