import { User } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleDTO } from '../../SecurityModule/dto';
import { CourseDTO } from 'src/CourseModule/dto';

export class UserDTO {
  @ApiModelProperty({ type: Number })
  @Expose()
  id: User['id'];

  @ApiModelProperty({ type: String })
  @Expose()
  name: User['name'];

  @ApiModelProperty({ type: String })
  @Expose()
  email: User['email'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlFacebook: User['urlFacebook'];

  @ApiModelProperty({ type: String })
  @Expose()
  urlInstagram: User['urlInstagram'];

  @ApiModelProperty({ type: RoleDTO })
  @Expose()
  @Type(() => RoleDTO)
  role: RoleDTO;

  @ApiModelProperty({ type: CourseDTO, isArray: true })
  @Expose()
  @Type(() => CourseDTO)
  createdCourses: CourseDTO[];
}
