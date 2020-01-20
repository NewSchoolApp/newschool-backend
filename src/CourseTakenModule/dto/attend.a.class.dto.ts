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
import { User } from '../../UserModule';
import { UserDTO } from '../../UserModule/dto';

export class AttendAClassDTO {
  @ApiModelProperty({ type: User })
  @Type(() => UserDTO)
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: Course })
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
