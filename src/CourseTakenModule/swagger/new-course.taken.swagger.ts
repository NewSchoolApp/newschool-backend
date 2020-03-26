import { ApiProperty } from '@nestjs/swagger';
import { CourseTaken } from '../entity/course.taken.entity';

export class NewCourseTakenSwagger {
  @ApiProperty({ type: String })
  user: CourseTaken['user'];

  @ApiProperty({ type: String })
  course: CourseTaken['course'];

  @ApiProperty({ type: String })
  status: CourseTaken['status'];
}
