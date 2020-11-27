import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CourseTakenStatusEnum } from '../enum/enum';
import { CourseTaken } from '../entity/course.taken.entity';

export class CourseTakenDTO {
  @IsNotEmpty()
  @Expose()
  userId: string;

  @IsNotEmpty()
  @Expose()
  courseId: number;

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

  @Expose()
  currentLessonId: number;

  @Expose()
  currentPartId: number;

  @Expose()
  currentTestId?: number;

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
