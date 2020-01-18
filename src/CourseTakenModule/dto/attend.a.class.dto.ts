import { CourseTaken } from '../entity';
import { Course, Lesson, Part, Test } from '../../CourseModule/entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CourseDTO, LessonDTO, PartDTO, TestWithoutCorrectAlternativeDTO } from '../../CourseModule/dto';

export class AttendAClassDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  @Expose()
  course: CourseDTO;

  @ApiModelProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: String })
  @Expose()
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentLesson: LessonDTO;

  @ApiModelProperty({ type: String })
  @Expose()
  currentPart: PartDTO;

  @ApiModelProperty({ type: String })
  @Expose()
  currentTest: TestWithoutCorrectAlternativeDTO;
}
