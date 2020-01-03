import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewStudentDTO {
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
}
