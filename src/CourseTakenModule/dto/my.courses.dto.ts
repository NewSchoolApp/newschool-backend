import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { User } from '../../UserModule/entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MyCoursesDTO {
  @ApiModelProperty({ type: Course })
  @Expose()
  course: CourseTaken['course'];

  @ApiModelProperty({ type: User })
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiModelProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: String })
  @Expose()
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
