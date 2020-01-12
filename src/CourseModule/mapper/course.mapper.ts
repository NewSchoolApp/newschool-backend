import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { CourseDTO } from '../dto/course.dto';
import { Course } from '../entity';

@Injectable()
export class CourseMapper extends Mapper<Course, CourseDTO> {

  constructor() {
    super(Course, CourseDTO);
  }

  toDto(entityObject: Partial<Course>): CourseDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Course[]): CourseDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: Partial<CourseDTO>): Course {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: CourseDTO[]): Course[] {
    return super.toEntityList(dtoArray);
  }
}
