import { User } from '../entity/user.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { UserProfileEnum } from '../enum/user-profile.enum';

export class UserUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: User['id'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  name: User['name'];

  @IsNotEmpty()
  @IsEnum(UserProfileEnum)
  @Expose()
  profile: User['profile'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  email: User['email'];

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

  @IsNotEmpty()
  @IsString()
  @Expose()
  institutionName: string;

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

  @IsEnum(RoleEnum)
  @IsOptional()
  @Expose()
  role?: RoleEnum;
}
