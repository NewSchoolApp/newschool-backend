import { CourseTaken } from '../entity';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
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
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  courseId: string;

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

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  completion: CourseTaken['completion'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  currentLessonId: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  currentPartId: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  currentTestId: string;
}
