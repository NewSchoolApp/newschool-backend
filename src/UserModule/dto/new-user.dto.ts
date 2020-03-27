import { User } from '../entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum';

export class NewUserDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: User['name'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  email: User['email'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: User['password'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  urlFacebook?: User['urlFacebook'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  urlInstagram?: User['urlInstagram'];

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  @Expose()
  role: RoleEnum;
}
