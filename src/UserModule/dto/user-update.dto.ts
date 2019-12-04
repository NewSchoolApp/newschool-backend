import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../../SecurityModule/enum';

export class UserUpdateDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  password: User['password'];

  @ApiModelProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;
}
