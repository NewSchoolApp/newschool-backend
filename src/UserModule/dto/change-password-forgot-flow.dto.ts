import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ChangePasswordForgotFlowDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  confirmNewPassword: string;
}
