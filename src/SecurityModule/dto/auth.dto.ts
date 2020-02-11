import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrantTypeEnum } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({ enum: ['client_credentials', 'password', 'refresh_token'] })
  @IsEnum(GrantTypeEnum)
  // eslint-disable-next-line camelcase
  grant_type: GrantTypeEnum;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line camelcase
  refresh_token?: string;
}
