import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Lesson } from '../entity/lesson.entity';

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
