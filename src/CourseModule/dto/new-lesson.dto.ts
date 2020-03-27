import { Lesson } from '../entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewLessonDTO {
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
  courseId: string;
}
