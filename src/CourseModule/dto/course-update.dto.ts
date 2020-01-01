import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CourseUpdateDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiModelProperty({ type: Number })
  @IsNotEmpty()
  @Expose()
  authorId: Course['authorId'];
}
