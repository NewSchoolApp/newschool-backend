import { CourseTaken } from '../entity';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseTakenStatusEnum } from '../enum';

export class CourseTakenUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  user: CourseTaken['user'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  course: CourseTaken['course'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @IsOptional()
  @IsString()
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @IsNotEmpty()
  @IsEnum(CourseTakenStatusEnum)
  @Expose()
  status: CourseTaken['status'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  completion: CourseTaken['completion'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @IsOptional()
  @IsString()
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
