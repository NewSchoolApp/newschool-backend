export { CourseModule } from './course.module';
export { Course, Lesson, Part, Test } from './entity';
export {
  LessonDTO,
  CourseDTO,
  NewLessonDTO,
  TestDTO,
  PartDTO,
  NewCourseDTO,
  CourseUpdateDTO,
  LessonUpdateDTO,
  NewPartDTO,
  NewTestDTO,
  PartUpdateDTO,
  TestUpdateDTO,
  TestWithoutCorrectAlternativeDTO,
} from './dto';
export {
  CourseRepository,
  LessonRepository,
  PartRepository,
  TestRepository,
} from './repository';
export {
  CourseService,
  LessonService,
  PartService,
  TestService,
} from './service';
