import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrantTypeEnum } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({ enum: ['client_credentials', 'password', 'refresh_token'] })
  @IsEnum(GrantTypeEnum)
  // tslint:disable-next-line:variable-name
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
