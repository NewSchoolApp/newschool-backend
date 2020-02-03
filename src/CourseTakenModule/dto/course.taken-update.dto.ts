import { CourseTaken } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../UserModule';
import { Course } from '../../CourseModule';
import { UserDTO } from '../../UserModule/dto';
import { CourseDTO } from '../../CourseModule/dto';

export class CourseTakenUpdateDTO {
  @ApiProperty({ type: () => UserDTO })
  @Type(() => UserDTO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  user: CourseTaken['user'];

  @ApiProperty({ type: () => CourseDTO })
  @IsString()
  @IsNotEmpty()
  @Expose()
  course: CourseTaken['course'];

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  courseStartDate: CourseTaken['courseStartDate'];

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  courseCompleteDate: CourseTaken['courseCompleteDate'];

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  status: CourseTaken['status'];

  @ApiProperty({ type: Number })
  @IsString()
  @IsNotEmpty()
  @Expose()
  completion: CourseTaken['completion'];

  @ApiProperty({ type: String })
  @Expose()
  currentLesson: CourseTaken['currentLesson'];

  @ApiProperty({ type: String })
  @Expose()
  currentPart: CourseTaken['currentPart'];

  @ApiProperty({ type: String })
  @Expose()
  currentTest: CourseTaken['currentTest'];
}
