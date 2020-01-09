import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDTO } from 'src/UserModule/dto';

export class CourseDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  id: Course['id'];

  @ApiModelProperty({ type: String })
  @Expose()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiModelProperty({ type: String })
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: Number })
  @Expose()
  @Type(() => UserDTO)
  author: UserDTO;

  @ApiModelProperty({ type: Number })
  @Expose()
  slug: string;
}
