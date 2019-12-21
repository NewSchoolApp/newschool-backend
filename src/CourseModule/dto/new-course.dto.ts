import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { Expose } from 'class-transformer';

export class NewCourseDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiModelProperty({ type: Number })
  @Expose()
  authorId: Course['authorId'];
}
