import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseTakenRepository } from '../repository';
import { CourseTaken } from '../entity';
import { CourseTakenUpdateDTO, NewCourseTakenDTO, AttendAClassDTO } from '../dto';
import { CourseTakenMapper } from '../mapper';
import { Course, Lesson, Part, Test, LessonService, PartService, TestService, CourseService } from '../../CourseModule';
import { CourseTakenStatusEnum } from '../enum';

@Injectable()
export class CourseTakenService {

  constructor(
    private readonly repository: CourseTakenRepository,
    private readonly mapper: CourseTakenMapper,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
    private readonly partService: PartService,
    private readonly testService: TestService,
  ){
  }

  @Transactional()
  public async add(newCourseTaken: NewCourseTakenDTO): Promise<CourseTaken> {
    const courseAlreadyTaken: CourseTaken = await this.repository.findByUserIdAndCourseId(newCourseTaken.user, newCourseTaken.course);
    if (courseAlreadyTaken){
        throw new ConflictException('Course already taken by user');
    }

    const newCourseTakenEntity = this.mapper.toEntity(newCourseTaken);

    newCourseTakenEntity.currentLesson = 1;
    newCourseTakenEntity.currentPart = 1;
    newCourseTakenEntity.currentTest = 1;
    newCourseTakenEntity.status = CourseTakenStatusEnum.TAKEN;
    newCourseTakenEntity.courseStartDate = new Date(Date.now());

    return this.repository.save(newCourseTakenEntity);
  }

  @Transactional()
  public async update(user: CourseTaken['user'], course: CourseTaken['course'], courseTakenUpdatedInfo: CourseTakenUpdateDTO): Promise<CourseTaken> {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(user, course);
    return this.repository.save(this.mapper.toEntity({ ...courseTaken, ...courseTakenUpdatedInfo}))
  }

  @Transactional()
  public async getAllByUserId(user: CourseTaken['user']): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByUserId(user);
    if (!courseTaken){
      throw new NotFoundException('This user did not started any course');
    }
    return courseTaken;
  }

  @Transactional()
  public async getAllByCourseId(course: CourseTaken['course']): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByCourseId(course);
    if (!courseTaken){
        throw new NotFoundException('No users have started this course');
    }
    return courseTaken;
  }

  @Transactional()
  public async attendAClass(user: string, courseId: string): Promise<AttendAClassDTO>{
    let courseTaken: CourseTaken = await this.findByUserIdAndCourseId(user, courseId);
    const attendAClass = new AttendAClassDTO;

    console.log(1)
    console.log(2)
    console.log('user: ' + user + ' course: ' + courseId);

    const course: Course = await this.courseService.findById(courseId);
    console.log('course: ' + JSON.stringify(course));
    const currentLesson: Lesson = await this.lessonService.findLessonByCourseIdAndSeqNum(courseId, courseTaken.currentLesson);
    console.log('currentLesson: ' + JSON.stringify(currentLesson));
    const currentPart: Part = await this.partService.findPartByLessonIdAndSeqNum(currentLesson.id, courseTaken.currentPart);
    console.log('currentPart: ' + JSON.stringify(currentPart));
    const currentTest: Test = await this.testService.findTestByPartIdAndSeqNum(currentPart.id, courseTaken.currentTest);
    console.log('currentTest: ' + JSON.stringify(currentTest));

    console.log(3)
    console.log(4)

    if (!(currentLesson && currentPart && currentTest)){
      this.updateCourseStatus(user, courseId);
      courseTaken = await this.findByUserIdAndCourseId(user, courseId);
    }

    attendAClass.user = courseTaken.user;
    attendAClass.course = course;
    attendAClass.currentLesson = currentLesson;
    attendAClass.currentPart = currentPart;
    attendAClass.currentTest = currentTest;
    attendAClass.completition = courseTaken.completition;
    attendAClass.status = courseTaken.status;

    return attendAClass;
  }

  @Transactional()
  public async findByUserIdAndCourseId(user: CourseTaken['user'], course: CourseTaken['course']): Promise<CourseTaken> {
    const courseTaken: CourseTaken = await this.repository.findOne({ user, course });
    if (!courseTaken){
        throw new NotFoundException('Course not taken by user');
    }
    return courseTaken;
  }

@Transactional()
public async updateCourseStatus(user: CourseTaken['user'], course: CourseTaken['course']): Promise<CourseTaken> {
  const courseTaken = await this.repository.findByUserIdAndCourseId(user, course);

  const currentLessonId: Lesson['id'] = await this.lessonService.getLessonIdByCourseIdAndSeqNum(course, courseTaken.currentLesson);
  const currentPartId = await this.partService.getPartIdByLessonIdAndSeqNum(currentLessonId, courseTaken.currentPart);

  const nextTest = await this.testService.getTestIdByPartIdAndSeqNum(currentPartId, courseTaken.currentTest+1);
  const nextPart = await this.partService.getPartIdByLessonIdAndSeqNum(currentLessonId, courseTaken.currentPart+1);
  const nextLesson = await this.lessonService.getLessonIdByCourseIdAndSeqNum(course, courseTaken.currentPart+1);

  courseTaken.completition = await this.calculateCompletition(courseTaken, currentLessonId, currentPartId);

  const courseTakenUpdatedInfo = await this.prepareCourseTakenUpdatedInfo(courseTaken, nextTest, nextPart, nextLesson);

  return this.update(courseTaken.user, courseTaken.course, courseTakenUpdatedInfo);
}

  @Transactional()
  private async prepareCourseTakenUpdatedInfo(courseTaken: CourseTaken, nextTest: string, nextPart: string, nextLesson: string){

    if (nextTest){
      courseTaken.currentTest++;
    } else if (nextPart){
        courseTaken.currentTest = 1;
        courseTaken.currentPart++;
    } else if (nextLesson) {
            courseTaken.currentTest = 1;
            courseTaken.currentPart = 1;
            courseTaken.currentLesson++;
    } else {
          courseTaken.status = CourseTakenStatusEnum.COMPLETED;
          courseTaken.courseCompleteDate = new Date(Date.now());
    }

    return await this.mapper.toUpdateDto(courseTaken);
  }

  private async calculateCompletition(courseTaken: CourseTaken, currentLesson: string, currentPart: string): Promise<number> {

    const lessonsAmount: number = await this.lessonService.getMaxValueForLesson(courseTaken.course);
    const partsAmount = await this.partService.getMaxValueForPart(currentLesson);
    const testsAmount = await this.testService.getMaxValueForTest(currentPart);

    const percentualPerLesson = 100/lessonsAmount;
    const percentualPerPart = percentualPerLesson/partsAmount;
    const percentualPerTest = percentualPerPart/testsAmount;

    let completition = percentualPerLesson*courseTaken.currentLesson;
    completition += percentualPerPart*courseTaken.currentPart;
    completition += percentualPerTest*courseTaken.currentTest;


    return completition>100 ?  100 : completition;
  }

  @Transactional()
  public async delete(user: CourseTaken['user'], course: CourseTaken['course']): Promise<void> {
    await this.repository.delete({ user, course });
  }
}
