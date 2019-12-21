import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../SecurityModule/entity';
import { Expose } from 'class-transformer';

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

  @ApiModelProperty({ type: Role })
  @IsNotEmpty()
  @Expose()
  role: Role;
}
