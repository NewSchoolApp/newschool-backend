import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewLessonDTO {
  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  title: Lesson['title'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  description: Lesson['description'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  course: Lesson['course'];
}
