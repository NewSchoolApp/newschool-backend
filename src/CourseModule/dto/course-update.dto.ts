import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class CourseUpdateDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  description: Course['description'];

  @ApiModelProperty({ type: Number })
  @IsNotEmpty()
  authorId: Course['authorId'];
}
