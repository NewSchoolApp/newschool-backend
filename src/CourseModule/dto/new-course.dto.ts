import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { User } from '../../UserModule';

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

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  workload: Course['workload'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  authorName: Course['authorName'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  authorDescription: Course['authorDescription'];
}
