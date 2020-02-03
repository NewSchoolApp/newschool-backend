import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Course } from '../../CourseModule/entity';
import { User } from '../../UserModule/entity';

export class NewCourseTakenDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  userId: User['id'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  courseId: Course['id'];
}
