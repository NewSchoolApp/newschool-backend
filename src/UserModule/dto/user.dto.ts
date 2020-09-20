import { User } from '../entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto/role.dto';
import { CourseDTO } from '../../CourseModule/dto/course.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';
import { EscolarityEnum } from '../enum/escolarity.enum';

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
  @IsString()
  @Expose()
  nickname: string;

  @Transform((date) => date && new Date(date))
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
  address: string;

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

  @ApiProperty({ type: () => CourseDTO, isArray: true })
  @Type(() => CourseDTO)
  @Expose()
  createdCourses: CourseDTO[];
}
