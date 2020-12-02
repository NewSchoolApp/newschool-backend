import { User } from '../entity/user.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserProfileEnum } from '../enum/user-profile.enum';

export class NewStudentDTO {
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
  institutionName?: string;

  @IsOptional()
  @IsString()
  @Expose()
  urlFacebook?: User['urlFacebook'];

  @IsOptional()
  @IsString()
  @Expose()
  urlInstagram?: User['urlInstagram'];
}
