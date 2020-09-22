import { User } from '../entity/user.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { UserProfileEnum } from '../enum/user-profile.enum';

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
  @IsEnum(UserProfileEnum)
  @Expose()
  profile: User['profile'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: User['password'];

  @IsOptional()
  @IsString()
  @Expose()
  nickname?: string;

  @Transform((date) => date && new Date(date))
  @IsOptional()
  @IsDate()
  @Expose()
  birthday?: Date;

  @IsOptional()
  @IsEnum(GenderEnum)
  @Expose()
  gender?: GenderEnum;

  @IsOptional()
  @IsEnum(EscolarityEnum)
  @Expose()
  schooling?: EscolarityEnum;

  @IsOptional()
  @IsString()
  @Expose()
  institutionName?: string;

  @IsOptional()
  @IsString()
  @Expose()
  profession?: string;

  @IsOptional()
  @IsString()
  @Expose()
  address?: string;

  @IsOptional()
  @IsString()
  @Expose()
  urlFacebook?: User['urlFacebook'];

  @IsOptional()
  @IsString()
  @Expose()
  urlInstagram?: User['urlInstagram'];

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  @Expose()
  role: RoleEnum;
}
