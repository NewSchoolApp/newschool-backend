import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { CourseTakenDTO, CourseTakenUpdateDTO } from '../dto';
import { CourseTaken } from '../entity';

@Injectable()
export class CourseTakenMapper extends Mapper<CourseTaken, CourseTakenDTO> {

  constructor() {
    super(CourseTaken, CourseTakenDTO);
  }

  toDto(entityObject: Partial<CourseTaken>): CourseTakenDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: CourseTaken[]): CourseTakenDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: Partial<CourseTakenDTO>): CourseTaken {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: CourseTakenDTO[]): CourseTaken[] {
    return super.toEntityList(dtoArray);
  }

  toUpdateDto(entityObject: CourseTaken): CourseTakenUpdateDTO {
    var updateDtoObject = new CourseTakenDTO();

    updateDtoObject.user = entityObject.user;
    updateDtoObject.course = entityObject.course;
    updateDtoObject.completition = entityObject.completition;
    updateDtoObject.courseStartDate = entityObject.courseStartDate;
    updateDtoObject.courseCompleteDate = entityObject.courseCompleteDate;
    updateDtoObject.status = entityObject.status;

    return updateDtoObject;
  }
}
