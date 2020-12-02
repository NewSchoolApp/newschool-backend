import { User } from '../entity/user.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto/role.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { UserProfileEnum } from '../enum/user-profile.enum';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: User['id'];

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
  nickname?: string;

  @Transform((date) => date && new Date(date))
  @IsNotEmpty()
  @IsDate()
  @Expose()
  birthday?: Date;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  @Expose()
  gender?: GenderEnum;

  @IsOptional()
  @IsNumber()
  @Expose()
  inviteKey: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  invitedByUserId: string;

  @IsNotEmpty()
  @IsEnum(EscolarityEnum)
  @Expose()
  schooling?: EscolarityEnum;

  @IsNotEmpty()
  @IsString()
  @Expose()
  institutionName?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  profession?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  address?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  city?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  state?: string;

  @IsOptional()
  @IsString()
  @Expose()
  urlFacebook?: User['urlFacebook'];

  @IsOptional()
  @IsString()
  @Expose()
  urlInstagram?: User['urlInstagram'];

  @Type(() => RoleDTO)
  @IsNotEmpty()
  @Expose()
  role: RoleDTO;

  @Expose()
  photo: string;
}
