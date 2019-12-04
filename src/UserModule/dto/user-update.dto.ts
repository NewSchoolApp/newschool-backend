import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';

export class UserUpdateDTO {
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
}
