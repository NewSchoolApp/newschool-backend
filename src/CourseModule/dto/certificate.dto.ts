import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { UserDTO } from '../../UserModule/dto/user.dto';
import { CourseTaken } from '../entity/course.taken.entity';
import { CourseDTO } from './course.dto';

export class CertificateDTO {
  @IsNotEmptyObject()
  @Type(() => UserDTO)
  @Expose()
  user: CourseTaken['user'];

  @IsNotEmptyObject()
  @Type(() => CourseDTO)
  @Expose()
  course: CourseTaken['course'];

  @IsNotEmpty()
  @IsDate()
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @IsNotEmpty()
  @IsDate()
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];
}
