import { User } from '../entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto/role.dto';
import { CourseDTO } from '../../CourseModule/dto/course.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
