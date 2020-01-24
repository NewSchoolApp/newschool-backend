import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ChangePasswordDTO {
  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  newPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  confirmNewPassword: string;
}
