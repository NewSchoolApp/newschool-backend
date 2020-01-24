import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { CourseTakenDTO, CourseTakenUpdateDTO, MyCoursesDTO } from '../dto';
import { CourseTaken } from '../entity';
import { Course } from '../../CourseModule/entity';
import { User } from '../../UserModule/entity';

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
    const updateDtoObject = new CourseTakenUpdateDTO();

    updateDtoObject.user = entityObject.user;
    updateDtoObject.course = entityObject.course;
    updateDtoObject.completition = entityObject.completition;
    updateDtoObject.courseStartDate = entityObject.courseStartDate;
    updateDtoObject.courseCompleteDate = entityObject.courseCompleteDate;
    updateDtoObject.status = entityObject.status;
    updateDtoObject.currentLesson = entityObject.currentLesson;
    updateDtoObject.currentPart = entityObject.currentPart;
    updateDtoObject.currentTest = entityObject.currentTest;

    return updateDtoObject;
  }

  toMyCourseDto(
    courseTakenArray: CourseTaken[],
    courseArray: Course[],
    user: User,
  ): MyCoursesDTO[] {
    let myCourseDtoArray: MyCoursesDTO[];

    courseTakenArray.forEach((courseTaken, index) => {
      myCourseDtoArray[index].course = courseArray[index];
      myCourseDtoArray[index].user = user;
      myCourseDtoArray[index].completition = courseTaken.completition;
      myCourseDtoArray[index].courseStartDate = courseTaken.courseStartDate;
      myCourseDtoArray[index].courseCompleteDate =
        courseTaken.courseCompleteDate;
      myCourseDtoArray[index].currentLesson = courseTaken.currentLesson;
      myCourseDtoArray[index].currentPart = courseTaken.currentPart;
      myCourseDtoArray[index].currentTest = courseTaken.currentTest;
      myCourseDtoArray[index].status = courseTaken.status;
    });

    return myCourseDtoArray;
  }
}
