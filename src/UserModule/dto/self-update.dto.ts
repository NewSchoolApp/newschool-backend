import { User } from '../entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SelfUpdateDTO {
  @IsOptional()
  @IsString()
  @Expose()
  id?: User['id'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: User['name'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  email: User['email'];

  @IsOptional()
  @IsString()
  @Expose()
  urlFacebook?: User['urlFacebook'];

  @IsOptional()
  @IsString()
  @Expose()
  urlInstagram?: User['urlInstagram'];
}
