import { Lesson } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class LessonDTO {
  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  id: Lesson['id'];

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

  @IsNumber()
  @Expose()
  @ApiModelProperty({ type: Number })
  sequenceNumber: Lesson['sequenceNumber'];
}
