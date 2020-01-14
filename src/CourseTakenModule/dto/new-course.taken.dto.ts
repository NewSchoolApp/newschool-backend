import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

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

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  status: CourseTaken['status'];
}
