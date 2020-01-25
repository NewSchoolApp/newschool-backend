import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewLessonDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  title: Lesson['title'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  description: Lesson['description'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  course: Lesson['course'];
}
