import { Injectable } from '@nestjs/common';
import { CourseDTO } from '../dto/course.dto';
import { Course } from '../entity/course.entity';
import { Mapper } from '../../CommonsModule/mapper/mapper';

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
