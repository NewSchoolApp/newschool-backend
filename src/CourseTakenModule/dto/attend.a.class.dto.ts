import { CourseTaken } from '../entity';
import { Course, Lesson, Part, Test } from '../../CourseModule/entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AttendAClassDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  @Expose()
  course: Course;

  @ApiModelProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: String })
  @Expose()
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentLesson: Lesson;

  @ApiModelProperty({ type: String })
  @Expose()
  currentPart: Part;

  @ApiModelProperty({ type: String })
  @Expose()
  currentTest: Test;
}
