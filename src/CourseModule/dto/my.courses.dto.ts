import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { CourseTakenStatusEnum } from '../enum/enum';
import { UserDTO } from '../../UserModule/dto/user.dto';
import { CourseTaken } from '../entity/course.taken.entity';
import { TestDTO } from './test.dto';
import { CourseDTO } from './course.dto';
import { LessonDTO } from './lesson.dto';
import { PartDTO } from './part.dto';

export class MyCoursesDTO {
  @IsNotEmptyObject()
  @Type(() => CourseDTO)
  @Expose()
  course: CourseTaken['course'];

  @IsNotEmptyObject()
  @Type(() => UserDTO)
  @Expose()
  user: CourseTaken['user'];

  @IsNotEmpty()
  @IsDate()
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @IsNotEmpty()
  @IsDate()
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @IsNotEmpty()
  @IsEnum(CourseTakenStatusEnum)
  @Expose()
  status: CourseTaken['status'];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  completion: CourseTaken['completion'];

  @IsNotEmptyObject()
  @Type(() => LessonDTO)
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @IsNotEmptyObject()
  @Type(() => PartDTO)
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @IsNotEmptyObject()
  @Type(() => TestDTO)
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
