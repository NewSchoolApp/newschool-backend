import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsOptional, IsString } from 'class-validator';
import { Role } from '../../SecurityModule/entity';
import { Expose } from 'class-transformer';

export class UserUpdateDTO {
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

  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  password: User['password'];

  @ApiModelProperty({ type: Role })
  @IsOptional()
  @Expose()
  role: Role;
}
