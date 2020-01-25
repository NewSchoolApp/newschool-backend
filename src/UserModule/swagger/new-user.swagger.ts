import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity';

export class NewUserSwagger {
  @ApiProperty({ type: String })
  name: User['name'];

  @ApiProperty({ type: String })
  email: User['email'];

  @ApiProperty({ type: String })
  password: User['password'];
}
