import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewLessonDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Lesson['title'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  description: Lesson['description'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  courseId: string;
}
