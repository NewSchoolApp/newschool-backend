import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  CourseDTO,
  LessonDTO,
  PartDTO,
  TestWithoutCorrectAlternativeDTO,
} from '../../CourseModule/dto';
import { UserDTO } from '../../UserModule/dto';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';

export class AttendAClassDTO {
  @IsNotEmptyObject()
  @Type(() => UserDTO)
  @Expose()
  user: UserDTO;

  @IsNotEmptyObject()
  @Type(() => CourseDTO)
  @Expose()
  course: CourseDTO;

  @IsNotEmpty()
  @IsString()
  @Expose()
  status: CourseTaken['status'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  completion: CourseTaken['completion'];

  @Type(() => LessonDTO)
  @Expose()
  currentLesson: LessonDTO;

  @Type(() => PartDTO)
  @Expose()
  currentPart: PartDTO;

  @Type(() => TestWithoutCorrectAlternativeDTO)
  @Expose()
  currentTest: TestWithoutCorrectAlternativeDTO;
}
