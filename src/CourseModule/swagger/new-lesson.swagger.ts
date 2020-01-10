import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';

export class NewLessonSwagger {
  @ApiModelProperty({ type: String })
  title: Lesson['title'];

  @ApiModelProperty({ type: String })
  description: Lesson['description'];

  @ApiModelProperty({ type: String })
  course: Lesson['course'];

  @ApiModelProperty({ type: Number })
  sequenceNumber: Lesson['sequenceNumber'];
}
