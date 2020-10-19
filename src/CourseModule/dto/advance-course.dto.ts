import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdvanceCourseDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  courseId: string;
}
