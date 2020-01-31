import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  CourseDTO,
  LessonDTO,
  PartDTO,
  TestWithoutCorrectAlternativeDTO,
} from '../../CourseModule/dto';
import { UserDTO } from '../../UserModule/dto';

export class AttendAClassDTO {
  @ApiProperty({ type: () => UserDTO })
  @Type(() => UserDTO)
  @Expose()
  user: UserDTO;

  @ApiProperty({ type: () => Course })
  @Expose()
  course: CourseDTO;

  @ApiProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiProperty({ type: String })
  @Expose()
  completion: CourseTaken['completion'];

  @ApiProperty({ type: () => LessonDTO })
  @Expose()
  currentLesson: LessonDTO;

  @ApiProperty({ type: () => PartDTO })
  @Expose()
  currentPart: PartDTO;

  @ApiProperty({ type: () => TestWithoutCorrectAlternativeDTO })
  @Expose()
  currentTest: TestWithoutCorrectAlternativeDTO;
}
