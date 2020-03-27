import { CourseTaken } from '../entity';
import { ApiProperty } from '@nestjs/swagger';

export class NewCourseTakenSwagger {
  @ApiProperty({ type: String })
  user: CourseTaken['user'];

  @ApiProperty({ type: String })
  course: CourseTaken['course'];

  @ApiProperty({ type: String })
  status: CourseTaken['status'];
}
