import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum';

export class NewUserDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  password: User['password'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ enum: RoleEnum })
  @IsNotEmpty()
  @Expose()
  role: RoleEnum;
}
