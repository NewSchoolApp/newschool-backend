import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../UserModule';
import { Course } from '../../CourseModule';
import { UserDTO } from '../../UserModule/dto';

export class CourseTakenUpdateDTO {
  @ApiModelProperty({ type: User })
  @Type(() => UserDTO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: Course })
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
