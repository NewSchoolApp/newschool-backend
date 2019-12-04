import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../../SecurityModule/enum';

export class NewUserDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  password: User['password'];

  @ApiModelProperty({ type: String })
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: User['role'];
}
