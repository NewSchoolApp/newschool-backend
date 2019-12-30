import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';

export class CourseUpdatedInfoSwagger {
  @ApiModelProperty({ type: String })
  title: Course['title'];

  @ApiModelProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  authorId: Course['authorId'];
}
