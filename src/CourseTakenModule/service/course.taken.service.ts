import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseTakenRepository } from '../repository';
import { CourseTaken } from '../entity';
import {
  AlternativeProgressionDTO,
  CourseTakenUpdateDTO,
  CurrentProgressionDTO,
  NewCourseTakenDTO,
  VideoProgressionDataDTO,
  VideoProgressionDTO,
} from '../dto';
import { CourseTakenMapper } from '../mapper';
import {
  Course,
  CourseService,
  Lesson,
  LessonService,
  Part,
  PartService,
  Test,
  TestService,
} from '../../CourseModule';
import { CourseTakenStatusEnum, StepEnum } from '../enum';
import { UserMapper } from '../../UserModule/mapper';
import { CertificateDTO } from '../dto/';
import { User } from '../../UserModule/entity';
import { UserService } from '../../UserModule/service';

@Injectable()
export class CourseTakenService {
  constructor(
    private readonly repository: CourseTakenRepository,
    private readonly mapper: CourseTakenMapper,
    private readonly userMapper: UserMapper,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
    private readonly partService: PartService,
    private readonly testService: TestService,
  ) {}

  @Transactional()
  public async add(newCourseTaken: NewCourseTakenDTO): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(newCourseTaken.userId),
      this.courseService.findById(newCourseTaken.courseId),
    ]);

    const lesson: Lesson = await this.lessonService.getByCourseAndSequenceNumber(
      course,
      1,
    );

    const part: Part = await this.partService.getByLessonAndSequenceNumber(
      lesson,
      1,
    );

    await this.repository.save({
      currentLesson: lesson,
      currentPart: part,
      currentTest: null,
      status: CourseTakenStatusEnum.TAKEN,
      courseStartDate: new Date(Date.now()),
      course,
      user,
    });
  }

  private async findByUserAndCourse(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ) {
    const courseTaken = await this.repository.findByUserAndCourseWithAllRelations(
      user,
      course,
    );
    if (!courseTaken) {
      throw new NotFoundException('CourseTaken not found');
    }
    return courseTaken;
  }

  public async getCurrentProgression(
    userId: string,
    courseId: string,
  ): Promise<CurrentProgressionDTO> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    const courseTaken = await this.findByUserAndCourse(user, course);
    if (!courseTaken.currentTest) {
      const videoProgression = new VideoProgressionDTO();
      const videoProgressionData = new VideoProgressionDataDTO();
      videoProgressionData.videoUrl =
        courseTaken.currentPart.youtubeUrl || courseTaken.currentPart.vimeoUrl;
      videoProgression.type = StepEnum.NEW_PART;
      if (courseTaken.currentPart.sequenceNumber === 1) {
        videoProgression.type = StepEnum.NEW_LESSON;
        videoProgressionData.lessonTitle = courseTaken.currentLesson.title;
      }
      videoProgression.data = videoProgressionData;
      return videoProgression;
    }

    const alternativeProgression = new AlternativeProgressionDTO();
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      correctAlternative,
      ...currentTestWithoutCorrectAlternative
    } = courseTaken.currentTest;
    const alternativeProgressionData = currentTestWithoutCorrectAlternative;
    alternativeProgression.type = StepEnum.NEW_TEST;
    alternativeProgression.data = alternativeProgressionData;
    return alternativeProgression;
  }

  public async advanceOnCourse(userId: string, courseId): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);

    const courseTaken = await this.findByUserAndCourse(user, course);

    const nextTestSequenceNumber: number = !courseTaken.currentTest
      ? 1
      : courseTaken.currentTest.sequenceNumber++;

    const nextTest: Test = await this.testService.getByPartAndSequenceNumber(
      courseTaken.currentPart,
      nextTestSequenceNumber,
    );

    if (nextTest) {
      const updatedCourseTaken = { ...courseTaken, currentTest: nextTest };
      updatedCourseTaken.completion = await this.calculateCompletion(
        updatedCourseTaken,
      );
      await this.repository.save(updatedCourseTaken);
      return;
    }

    const nextPart: Part = await this.partService.getByLessonAndSequenceNumber(
      courseTaken.currentLesson,
      courseTaken.currentPart.sequenceNumber++,
    );

    if (nextPart) {
      const updatedCourseTaken = {
        ...courseTaken,
        currentTest: null,
        currentPart: nextPart,
      };
      updatedCourseTaken.completion = await this.calculateCompletion(
        updatedCourseTaken,
      );
      await this.repository.save(updatedCourseTaken);
      return;
    }

    const nextLesson: Lesson = await this.lessonService.getByCourseAndSequenceNumber(
      courseTaken.course,
      courseTaken.currentLesson.sequenceNumber++,
    );

    if (nextLesson) {
      const nextPart: Part = await this.partService.getByLessonAndSequenceNumber(
        nextLesson,
        1,
      );
      const updatedCourseTaken = {
        ...courseTaken,
        currentTest: null,
        currentPart: nextPart,
        currentLesson: nextLesson,
      };
      updatedCourseTaken.completion = await this.calculateCompletion(
        updatedCourseTaken,
      );
      await this.repository.save(updatedCourseTaken);
      return;
    }

    await this.repository.save({
      ...courseTaken,
      completion: 100,
      status: CourseTakenStatusEnum.COMPLETED,
    });
  }

  @Transactional()
  public async update(
    userId: string,
    courseId: string,
    courseTakenUpdatedInfo: CourseTakenUpdateDTO,
  ): Promise<CourseTaken> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);

    const courseTaken: CourseTaken = await this.findByUserAndCourse(
      user,
      course,
    );

    return this.repository.save(
      this.mapper.toEntity({ ...courseTaken, ...courseTakenUpdatedInfo }),
    );
  }

  @Transactional()
  public async getAllByUserId(
    user: CourseTaken['user'],
  ): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByUserId(user);
    if (!courseTaken) {
      throw new NotFoundException('This user did not started any course');
    }
    return courseTaken;
  }

  @Transactional()
  public async getAllByCourseId(
    course: CourseTaken['course'],
  ): Promise<CourseTaken[]> {
    const courseTaken: CourseTaken[] = await this.repository.findByCourseId(
      course,
    );
    if (!courseTaken) {
      throw new NotFoundException('No users have started this course');
    }
    return courseTaken;
  }

  @Transactional()
  public async findByUserIdAndCourseId(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CourseTaken> {
    const courseTaken: CourseTaken = await this.repository.findOne(
      { user, course },
      { relations: ['user', 'course'] },
    );
    if (!courseTaken) {
      throw new NotFoundException('Course not taken by user');
    }
    return courseTaken;
  }

  private async calculateCompletion(courseTaken: CourseTaken): Promise<number> {
    if (courseTaken.status === CourseTakenStatusEnum.COMPLETED) {
      return 100;
    }

    const [
      lessonsQuantity,
      partsQuantity,
      testsQuantity,
    ]: number[] = await Promise.all([
      this.lessonService.countByCourse(courseTaken.course),
      this.partService.countByLesson(courseTaken.currentLesson),
      this.testService.countByPart(courseTaken.currentPart),
    ]);

    let completion: number;

    const percentualPerLesson = 100 / lessonsQuantity;
    const percentualPerPart = percentualPerLesson / partsQuantity;
    const percentualPerTest = percentualPerPart / testsQuantity;

    completion =
      percentualPerLesson * (courseTaken.currentLesson.sequenceNumber - 1);
    completion +=
      percentualPerPart * (courseTaken.currentPart.sequenceNumber - 1);
    completion += percentualPerTest * courseTaken.currentTest.sequenceNumber;

    return completion > 100 ? 100 : completion;
  }

  @Transactional()
  public async delete(userId: string, courseId: string): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    await this.repository.delete({ user, course });
  }

  @Transactional()
  public async getCertificate(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CertificateDTO> {
    return this.repository.findCertificateByUserIdAndCourseId(user, course);
  }

  @Transactional()
  public async getCertificates(user: User['id']): Promise<CertificateDTO[]> {
    return this.repository.findCertificatesByUserId(user);
  }
}
