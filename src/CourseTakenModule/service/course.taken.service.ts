import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseTakenRepository } from '../repository';
import { CourseTaken } from '../entity';
import { CourseTakenDTO, CourseTakenUpdateDTO, NewCourseTakenDTO } from '../dto';
import { CourseTakenMapper } from '../mapper';
import { Course, Lesson, Part, Test, CourseService, LessonService, PartService, TestService } from '../../CourseModule';
import { UserService, User } from '../../UserModule';
import { CourseTakenStatusEnum } from '../enum';

@Injectable()
export class CourseTakenService {

  constructor(
    private readonly repository: CourseTakenRepository,
    private readonly mapper: CourseTakenMapper,
    private readonly userService: UserService,
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

    var newCourseTakenEntity = this.mapper.toEntity(newCourseTaken);

    newCourseTakenEntity.currentLesson = 1;
    newCourseTakenEntity.currentPart = 1;
    newCourseTakenEntity.currentTest = 1;

    'TAKEN';

    return this.repository.save(newCourseTakenEntity);
  }

  @Transactional()
  public async update(user: CourseTaken['user'], course: CourseTaken['course'], courseTakenUpdatedInfo: CourseTakenUpdateDTO): Promise<CourseTaken> {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(user, course);
    return this.repository.save(this.mapper.toEntity({ ...courseTaken, ...courseTakenUpdatedInfo}))
  }

  @Transactional()
  public async getAllCoursesByUserId(user: CourseTaken['user']): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByUserId(user);
    if (!courseTaken){
      throw new NotFoundException('This user did not started any course');
    }
    return courseTaken;
  }

  @Transactional()
  public async getAllUsersByCourseId(course: CourseTaken['course']): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByCourseId(course);
    if (!courseTaken){
        throw new NotFoundException('No users have started this course');
    }
    return courseTaken;
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
  var courseTaken = await this.repository.findByUserIdAndCourseId(user, course);

  const currentLessonId: Lesson['id'] = await this.lessonService.getLessonByCourseIdAndSeqNum(course, courseTaken.currentLesson);
  const currentPartId = await this.partService.getPartByLessonIdAndSeqNum(currentLessonId, courseTaken.currentPart);

  const nextTest = await this.testService.getTestByPartIdAndSeqNum(currentPartId, courseTaken.currentTest+1);
  const nextPart = await this.partService.getPartByLessonIdAndSeqNum(currentLessonId, courseTaken.currentPart+1);
  const nextLesson = await this.lessonService.getLessonByCourseIdAndSeqNum(course, courseTaken.currentPart+1);

  const courseTakenUpdatedInfo = await this.prepareCourseTakenUpdatedInfo(courseTaken, nextTest, nextPart, nextLesson);

  return this.update(courseTaken.user, courseTaken.course, courseTakenUpdatedInfo);
}

  @Transactional()
  private async prepareCourseTakenUpdatedInfo(courseTaken: CourseTaken, nextTest: string, nextPart: string, nextLesson: string){

    if (nextTest){
      courseTaken.currentTest++;
    }
    else if (nextPart){
        courseTaken.currentTest = 1;
        courseTaken.currentPart++;
    }
    else if (nextLesson) {
            courseTaken.currentTest = 1;
            courseTaken.currentPart = 1;
            courseTaken.currentLesson++;
    }
    else {
          courseTaken.status = CourseTakenStatusEnum.COMPLETED;
          courseTaken.courseCompleteDate = new Date(Date.now());
    }
    return await this.mapper.toUpdateDto(courseTaken)

  }

  @Transactional()
  public async delete(user: CourseTaken['user'], course: CourseTaken['course']): Promise<void> {
      await this.repository.delete({ user, course });
  }
}