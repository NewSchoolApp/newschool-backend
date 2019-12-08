import { User } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UserDTO {
  @ApiModelProperty({ type: Number })
  id: User['id'];

  @ApiModelProperty({ type: String })
  name: User['name'];

  @ApiModelProperty({ type: String })
  email: User['email'];

  @ApiModelProperty({ type: String })
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ type: String })
  password: User['password'];

  @ApiModelProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: User['role'];
}
