import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrantTypeEnum } from '../enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiModelProperty({ enum: ['client_credentials', 'password'] })
  @IsEnum(GrantTypeEnum)
  // tslint:disable-next-line:variable-name
  grant_type: GrantTypeEnum;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  refresh_token: string;
}
