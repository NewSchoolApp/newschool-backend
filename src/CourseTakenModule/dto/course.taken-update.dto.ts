import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../UserModule';
import { Course } from '../../CourseModule';

export class CourseTakenUpdateDTO {
  @ApiModelProperty({ type: User })
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
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiModelProperty({ type: String })
  @IsString()
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  status: CourseTaken['status'];

  @ApiModelProperty({ type: Number })
  @IsString()
  @IsNotEmpty()
  @Expose()
  completition: CourseTaken['completition'];
}
