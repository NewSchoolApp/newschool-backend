import { CourseTaken } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserDTO } from '../../UserModule/dto';
import { CourseDTO } from '../../CourseModule/dto';

export class CertificateDTO {
  @ApiProperty({ type: () => UserDTO })
  @Type(() => UserDTO)
  @IsString()
  @Expose()
  user: CourseTaken['user'];

  @ApiProperty({ type: () => CourseDTO })
  @IsString()
  @Expose()
  course: CourseTaken['course'];

  @ApiProperty({ type: String })
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiProperty({ type: String })
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];
}
