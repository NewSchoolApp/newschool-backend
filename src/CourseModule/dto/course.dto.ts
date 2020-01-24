import { Course } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseDTO {
  @ApiModelProperty({ type: String })
  @Expose()
  id: Course['id'];

  @ApiModelProperty({ type: String })
  @Expose()
  title: Course['title'];

  @ApiModelProperty({ type: String })
  @Expose()
  description: Course['description'];

  @ApiModelProperty({ type: String })
  @Expose()
  workload: Course['workload'];

  @ApiModelProperty({ type: String })
  @Expose()
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  @Expose()
  enabled: Course['enabled'];

  @ApiModelProperty({ type: String })
  @Expose()
  authorName: string;

  @ApiModelProperty({ type: String })
  @Expose()
  authorDescription: string;

  @ApiModelProperty({ type: Number })
  @Expose()
  slug: string;
}
