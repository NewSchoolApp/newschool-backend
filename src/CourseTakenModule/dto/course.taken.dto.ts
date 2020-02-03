import { CourseTaken } from '../entity';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { UserDTO } from '../../UserModule/dto';
import { CourseDTO } from '../../CourseModule/dto';
import { CourseTakenStatusEnum } from '../enum';
import { Lesson, Part, Test } from '../../CourseModule/entity';

export class CourseTakenDTO {
  @IsNotEmpty()
  @Type(() => UserDTO)
  @Expose()
  user: CourseTaken['user'];

  @IsNotEmptyObject()
  @Type(() => CourseDTO)
  @Expose()
  course: CourseTaken['course'];

  @IsNotEmpty()
  @IsDate()
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @IsOptional()
  @IsDate()
  @Expose()
  courseCompleteDate?: CourseTaken['courseCompleteDate'];

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

  @Type(() => Lesson)
  @IsNotEmptyObject()
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @Type(() => Part)
  @IsNotEmptyObject()
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @Type(() => Test)
  @IsNotEmptyObject()
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
