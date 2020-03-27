import { Course } from '../entity';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CourseDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: Course['id'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Course['title'];

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

  @IsOptional()
  @IsString()
  @Expose()
  thumbUrl?: Course['thumbUrl'];

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  enabled: Course['enabled'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  authorName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  authorDescription: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  slug: string;
}
