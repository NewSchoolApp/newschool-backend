import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum';

export class UserUpdateDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  id: User['id'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ type: RoleEnum })
  @IsOptional()
  @Expose()
  role: RoleEnum;
}
