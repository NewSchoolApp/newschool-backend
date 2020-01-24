import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserDTO } from '../../UserModule/dto';
import { CourseDTO } from '../../CourseModule/dto';

export class CertificateDTO {
  @ApiModelProperty({ type: UserDTO })
  @Type(() => UserDTO)
  @IsString()
  @Expose()
  user: CourseTaken['user'];

  @ApiModelProperty({ type: CourseDTO })
  @IsString()
  @Expose()
  course: CourseTaken['course'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiModelProperty({ type: String })
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];
}
