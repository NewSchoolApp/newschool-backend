import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  CourseDTO,
  LessonDTO,
  PartDTO,
  TestWithoutCorrectAlternativeDTO,
} from '../../CourseModule/dto';
import { UserDTO } from '../../UserModule/dto';

export class AttendAClassDTO {
  @ApiModelProperty({ type: UserDTO })
  @Type(() => UserDTO)
  @Expose()
  user: UserDTO;

  @ApiModelProperty({ type: Course })
  @Expose()
  course: CourseDTO;

  @ApiModelProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: String })
  @Expose()
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: LessonDTO })
  @Expose()
  currentLesson: LessonDTO;

  @ApiModelProperty({ type: PartDTO })
  @Expose()
  currentPart: PartDTO;

  @ApiModelProperty({ type: TestWithoutCorrectAlternativeDTO })
  @Expose()
  currentTest: TestWithoutCorrectAlternativeDTO;
}
