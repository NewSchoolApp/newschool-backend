import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class CourseDTO {
  @ApiModelProperty({ type: Number })
  id: Course['id'];

  @ApiModelProperty({ type: String })
  title: Course['title'];

  @ApiModelProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: Number })
  authorId: Course['authorId'];


}
