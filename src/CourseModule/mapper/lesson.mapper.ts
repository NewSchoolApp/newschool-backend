import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { LessonDTO } from '../dto/lesson.dto';
import { Lesson } from '../entity';

@Injectable()
export class LessonMapper extends Mapper<Lesson, LessonDTO> {

  constructor() {
    super(Lesson, LessonDTO);
  }

  toDto(entityObject: Lesson): LessonDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Lesson[]): LessonDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: LessonDTO): Lesson {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: LessonDTO[]): Lesson[] {
    return super.toEntityList(dtoArray);
  }
}
