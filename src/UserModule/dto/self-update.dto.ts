import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SelfUpdateDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  id: User['id'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  urlInstagram: User['urlInstagram'];
}
