import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrantTypeEnum } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({ enum: ['client_credentials', 'password', 'refresh_token'] })
  @IsEnum(GrantTypeEnum)
  // tslint:disable-next-line:variable-name
  grant_type: GrantTypeEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refresh_token: string;
}
