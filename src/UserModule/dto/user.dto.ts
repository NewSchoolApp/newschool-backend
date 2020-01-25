import { User } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto';
import { CourseDTO } from '../../CourseModule/dto';

export class UserDTO {
  @ApiProperty({ type: Number })
  @Expose()
  id: User['id'];

  @ApiProperty({ type: String })
  @Expose()
  name: User['name'];

  @ApiProperty({ type: String })
  @Expose()
  email: User['email'];

  @ApiProperty({ type: String })
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiProperty({ type: String })
  @Expose()
  urlInstagram: User['urlInstagram'];

  @ApiProperty({ type: () => RoleDTO })
  @Expose()
  @Type(() => RoleDTO)
  role: RoleDTO;

  @ApiProperty({ type: () => CourseDTO, isArray: true })
  @Expose()
  @Type(() => CourseDTO)
  createdCourses: CourseDTO[];
}
