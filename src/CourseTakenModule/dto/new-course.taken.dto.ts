import { CourseTaken } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewCourseTakenDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  user: CourseTaken['user'];

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  course: CourseTaken['course'];
}
