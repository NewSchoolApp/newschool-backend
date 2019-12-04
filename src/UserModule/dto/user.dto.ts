import { User } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiModelProperty({ type: Number })
  id: User['id'];

  @ApiModelProperty({ type: String })
  name: User['name'];

  @ApiModelProperty({ type: String })
  email: User['email'];

  @ApiModelProperty({ type: String })
  password: User['password'];

}

export type NewUserDTO = Omit<UserDTO, 'id'>;
