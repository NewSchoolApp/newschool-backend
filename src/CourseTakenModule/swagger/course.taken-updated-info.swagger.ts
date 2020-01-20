import { ApiModelProperty } from '@nestjs/swagger';
import { CourseTaken } from '../entity';

export class CourseTakenUpdatedInfoSwagger {
  @ApiModelProperty({ type: String })
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  course: CourseTaken['course'];

  @ApiModelProperty({ type: String })
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiModelProperty({ type: String })
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiModelProperty({ type: Number })
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: Number })
  currentLesson: CourseTaken['currentLesson'];

  @ApiModelProperty({ type: Number })
  currentPart: CourseTaken['currentPart'];

  @ApiModelProperty({ type: Number })
  currentTest: CourseTaken['currentTest'];
}
