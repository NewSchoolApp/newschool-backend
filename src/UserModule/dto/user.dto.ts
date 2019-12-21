import { User } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDTO {
  @ApiModelProperty({ type: Number })
  @Expose()
  id: User['id'];

  @ApiModelProperty({ type: String })
  @Expose()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @Expose()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ type: String })
  @Expose()
  password: User['password'];

  @ApiModelProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @Expose()
  role: User['role'];
}
