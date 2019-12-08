import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsNotEmpty } from 'class-validator';

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

  @ApiModelProperty({ type: User['role'] })
  @IsNotEmpty()
  role: User['role'];
}
