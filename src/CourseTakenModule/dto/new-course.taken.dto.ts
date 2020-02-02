import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Course } from '../../CourseModule/entity';
import { User } from '../../UserModule/entity';

export class NewCourseTakenDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: User['id'];

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  courseId: Course['id'];
}
