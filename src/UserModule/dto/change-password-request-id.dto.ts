import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ChangePasswordRequestIdDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;
}
