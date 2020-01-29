import { ApiProperty } from '@nestjs/swagger';
import { CourseTaken } from '../entity';

export class CourseTakenUpdatedInfoSwagger {
  @ApiProperty({ type: String })
  user: CourseTaken['user'];

  @ApiProperty({ type: String })
  course: CourseTaken['course'];

  @ApiProperty({ type: String })
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiProperty({ type: String })
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiProperty({ type: Number })
  completion: CourseTaken['completion'];

  @ApiProperty({ type: Number })
  currentLesson: CourseTaken['currentLesson'];

  @ApiProperty({ type: Number })
  currentPart: CourseTaken['currentPart'];

  @ApiProperty({ type: Number })
  currentTest: CourseTaken['currentTest'];
}
