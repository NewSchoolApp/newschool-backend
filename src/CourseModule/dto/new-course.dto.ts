import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class NewCourseDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  workload: Course['workload'];

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  authorName: Course['authorName'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  authorDescription: Course['authorDescription'];
}
