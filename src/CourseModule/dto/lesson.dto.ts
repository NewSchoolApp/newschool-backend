import { Lesson } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LessonDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  id: Lesson['id'];

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

  @IsNumber()
  @Expose()
  @ApiProperty({ type: Number })
  sequenceNumber: Lesson['sequenceNumber'];
}
