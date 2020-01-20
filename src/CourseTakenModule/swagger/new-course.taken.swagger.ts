import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class NewCourseTakenSwagger {
  @ApiModelProperty({ type: String })
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  course: CourseTaken['course'];

  @ApiModelProperty({ type: String })
  status: CourseTaken['status'];
}
