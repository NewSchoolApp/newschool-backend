import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class NewCourseDTO {
  @ApiModelProperty({ type: String })
  title: Course['title'];

  @ApiModelProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  description: Course['description'];

  @ApiModelProperty({ type: Number })
  authorId: Course['authorId'];
}
