import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SelfUpdateDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Expose()
  id: User['id'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  name: User['name'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  email: User['email'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  urlInstagram: User['urlInstagram'];
}
