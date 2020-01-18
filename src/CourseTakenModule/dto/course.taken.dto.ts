import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CourseTakenDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  course: CourseTaken['course'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiModelProperty({ type: String })
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: String })
  @Expose()
  completition: CourseTaken['completition'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @ApiModelProperty({ type: String })
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
