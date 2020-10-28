import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CourseTakenStatusEnum } from '../enum/enum';
import { UserDTO } from '../../UserModule/dto/user.dto';
import { CourseTaken } from '../entity/course.taken.entity';
import { CourseDTO } from './course.dto';
import { Part } from '../entity/part.entity';
import { Lesson } from '../entity/lesson.entity';
import { Test } from '../entity/test.entity';

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  @Expose()
  rating?: CourseTaken['rating'];

  @IsOptional()
  @IsString()
  @Expose()
  feedback?: CourseTaken['feedback'];
}
