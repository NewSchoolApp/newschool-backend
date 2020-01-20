import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewCourseTakenDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  course: CourseTaken['course'];
}
