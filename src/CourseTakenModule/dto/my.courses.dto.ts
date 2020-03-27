import { CourseTaken } from '../entity';
import { Expose, Type } from 'class-transformer';
import { CourseDTO, LessonDTO, PartDTO, TestDTO } from '../../CourseModule/dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { UserDTO } from '../../UserModule/dto';
import { CourseTakenStatusEnum } from '../enum';

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
