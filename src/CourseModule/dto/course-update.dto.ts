import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Course } from '../entity/course.entity';

export class CourseUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Course['title'];

  @IsOptional()
  @IsString()
  @Expose()
  thumbUrl?: Course['thumbUrl'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Course['description'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  workload: Course['workload'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  authorName: Course['authorName'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  authorDescription: Course['authorDescription'];
}
