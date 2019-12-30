import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class CourseDTO {
  @ApiModelProperty({ type: String })
  id: Course['id'];

  @ApiModelProperty({ type: String })
  title: Course['title'];
  
  @ApiModelProperty({ type: String })
  description: Course['description'];

  @ApiModelProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: Number })
  authorId: Course['authorId'];
}
