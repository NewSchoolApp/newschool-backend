import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class NewCourseDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  description: Course['description'];

  @ApiModelProperty({ type: Number })
  @IsString()
  @Expose()
  authorId: Course['authorId'];
}
