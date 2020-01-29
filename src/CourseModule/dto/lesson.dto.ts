import { Lesson } from '../entity';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class LessonDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: Lesson['id'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Lesson['title'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Lesson['description'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  course: Lesson['course'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  sequenceNumber: Lesson['sequenceNumber'];
}
