import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';

export class LessonUpdatedInfoSwagger {
  @ApiProperty({ type: String })
  title: Lesson['title'];

  @ApiProperty({ type: String })
  description: Lesson['description'];

  @ApiProperty({ type: String })
  course: Lesson['course'];

  @ApiProperty({ type: Number })
  sequenceNumber: Lesson['sequenceNumber'];
}
