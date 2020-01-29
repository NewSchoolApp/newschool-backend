import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { User } from '../../UserModule/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MyCoursesDTO {
  @ApiProperty({ type: () => Course })
  @Expose()
  course: CourseTaken['course'];

  @ApiProperty({ type: () => User })
  @Expose()
  user: CourseTaken['user'];

  @ApiProperty({ type: String })
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiProperty({ type: String })
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiProperty({ type: String })
  @Expose()
  completion: CourseTaken['completion'];

  @ApiProperty({ type: String })
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @ApiProperty({ type: String })
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @ApiProperty({ type: String })
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
