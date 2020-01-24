import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';

export class UserUpdatedInfoSwagger {
  @ApiModelProperty({ type: String })
  name: User['name'];

  @ApiModelProperty({ type: String })
  email: User['email'];

  @ApiModelProperty({ type: String })
  password: User['password'];
}
