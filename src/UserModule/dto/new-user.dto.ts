import { User } from '../entity/user.entity';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';

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
  nickname: string;

  @Transform(date => date && new Date(date))
  @IsNotEmpty()
  @IsDate()
  @Expose()
  birthday: Date;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  @Expose()
  gender: GenderEnum;

  @IsNotEmpty()
  @IsEnum(EscolarityEnum)
  @Expose()
  schooling: EscolarityEnum;

  @IsNotEmpty()
  @IsString()
  @Expose()
  institutionName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  profession: string;

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
