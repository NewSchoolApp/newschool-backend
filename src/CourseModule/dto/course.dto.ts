import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class CourseDTO {
  @ApiModelProperty({ type: Number })
  id: Course['id'];

  @ApiModelProperty({ type: String })
  title: Course['title'];

  @ApiModelProperty({ type: Number })
  authorId: Course['authorId'];


}
