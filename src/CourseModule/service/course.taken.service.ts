import { Course } from '../entity/course.entity';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CourseTakenStatusEnum } from '../enum/enum';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { UserMapper } from '../../UserModule/mapper/user.mapper';
import { User } from '../../UserModule/entity/user.entity';
import { UserService } from '../../UserModule/service/user.service';
import { VideoProgressionDTO } from '../dto/video-progression.dto';
import { CourseTakenRepository } from '../repository/course.taken.repository';
import { CourseTakenMapper } from '../mapper/course-taken.mapper';
import { StepEnum } from '../enum/step.enum';
import { NewCourseTakenDTO } from '../dto/new-course.taken.dto';
import { CourseTakenUpdateDTO } from '../dto/course.taken-update.dto';
import { CurrentProgressionDTO } from '../dto/current-progression.dto';
import { AlternativeProgressionDTO } from '../dto/alternative-progression.dto';
import { VideoProgressionDataDTO } from '../dto/video-progression-data.dto';
import { CourseTaken } from '../entity/course.taken.entity';
import { CertificateDTO } from '../dto/certificate.dto';
import { TestService } from './test.service';
import { CourseService } from './course.service';
import { Part } from '../entity/part.entity';
import { PartService } from './part.service';
import { LessonService } from './lesson.service';
import { Lesson } from '../entity/lesson.entity';
import { Test } from '../entity/test.entity';
import { getCoursesByFinished } from 'src/DashboardModule/interfaces/getCoursesByFinished';
import { NpsCourseTakenDTO } from '../dto/nps-course-taken.dto';
import { PublisherService } from '../../GameficationModule/service/publisher.service';

@Injectable()
export class CourseTakenService {
  @Inject(PublisherService)
  private readonly publisherService: PublisherService;

  constructor(
    private readonly repository: CourseTakenRepository,
    private readonly mapper: CourseTakenMapper,
    private readonly userMapper: UserMapper,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
    private readonly partService: PartService,
    private readonly testService: TestService,
    private readonly publisherService: PublisherService,
  ) {}

  @Transactional()
  public async add(newCourseTakenDto: NewCourseTakenDTO): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(newCourseTakenDto.userId),
      this.courseService.findById(newCourseTakenDto.courseId),
    ]);

    const courseTaken = await this.repository.findByUserAndCourseWithAllRelations(
      user,
      course,
    );

    if (courseTaken) {
      throw new ConflictException('This user has already started this course');
    }

    const lesson: Lesson = await this.lessonService.getByCourseAndSequenceNumber(
      course,
      1,
    );

    const part: Part = await this.partService.getByLessonAndSequenceNumber(
      lesson,
      1,
    );
    const newCourseTaken = new CourseTaken();
    newCourseTaken.user = user;
    newCourseTaken.course = course;
    newCourseTaken.course = course;
    newCourseTaken.currentLesson = lesson;
    newCourseTaken.currentPart = part;
    newCourseTaken.currentTest = null;
    newCourseTaken.status = CourseTakenStatusEnum.TAKEN;
    newCourseTaken.courseStartDate = new Date(Date.now());

    await this.repository.save(newCourseTaken);
  }

  public async getActiveUsersQuantity(): Promise<number> {
    return this.repository.getActiveUsersQuantity();
  }

  private async findByUserAndCourse(
    user: CourseTaken['user'],
    course: CourseTaken['course'],
  ): Promise<CourseTaken> {
    const courseTaken = await this.repository.findByUserAndCourseWithAllRelations(
      user,
      course,
    );
    if (!courseTaken) {
      throw new NotFoundException('CourseTaken not found');
    }
    return courseTaken;
  }

  public async getCertificateQuantity(): Promise<number> {
    return this.repository.getCertificateQuantity();
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

    if (courseTaken.status === CourseTakenStatusEnum.COMPLETED) {
      return { ...courseTaken, type: StepEnum.NEW_TEST };
    }

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

  public async advanceOnCourse(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);

    const courseTaken = await this.findByUserAndCourse(user, course);
    if (
      courseTaken.completion === 100 &&
      courseTaken.status === CourseTakenStatusEnum.COMPLETED
    )
      return;
    const nextTest: Test = await this.testService.getByPartAndSequenceNumber(
      courseTaken.currentPart,
      this.getNextSequenceNumber(courseTaken.currentTest),
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
      this.getNextSequenceNumber(courseTaken.currentPart),
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
      this.getNextSequenceNumber(courseTaken.currentLesson),
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

    const completedCouse = this.getCompletedByUserIdAndCourseId(
      user.id,
      course.id,
    );
    if (!completedCouse) return;

    await this.repository.save({
      ...courseTaken,
      completion: 100,
      status: CourseTakenStatusEnum.COMPLETED,
      courseCompleteDate: new Date(Date.now()),
    });
    this.publisherService.emitCourseCompleted(courseTaken);
  }

  private getNextSequenceNumber(step: Lesson | Part | Test): number {
    if (!step) {
      return 1;
    }
    return step.sequenceNumber + 1;
  }

  @Transactional()
  public async update(
    userId: string,
    courseId: string,
    courseTakenUpdatedInfo: CourseTakenUpdateDTO,
  ): Promise<CourseTaken> {
    const [user, course, currentTest, currentLesson, currentPart]: [
      User,
      Course,
      Test,
      Lesson,
      Part,
    ] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
      this.testService.findById(courseTakenUpdatedInfo.currentTestId),
      this.lessonService.findById(courseTakenUpdatedInfo.currentLessonId),
      this.partService.findById(courseTakenUpdatedInfo.currentPartId),
    ]);

    const courseTaken: CourseTaken = await this.findByUserAndCourse(
      user,
      course,
    );

    return this.repository.save(
      this.mapper.toEntity({
        ...courseTaken,
        ...courseTakenUpdatedInfo,
        currentLesson,
        currentTest,
        currentPart,
      }),
    );
  }

  @Transactional()
  public async findAllByUserId(userId: string): Promise<CourseTaken[]> {
    const user: User = await this.userService.findById(userId);
    const courseTaken: CourseTaken[] = await this.repository.findByUser(user);
    if (!courseTaken) {
      throw new NotFoundException('This user did not started any course');
    }
    return courseTaken;
  }

  @Transactional()
  public async getAllByCourseId(courseId: string): Promise<CourseTaken[]> {
    const course: Course = await this.courseService.findById(courseId);
    const courseTaken: CourseTaken[] = await this.repository.findByCourse(
      course,
    );
    if (!courseTaken) {
      throw new NotFoundException('No users have started this course');
    }
    return courseTaken;
  }

  @Transactional()
  public async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseTaken> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    const courseTaken = this.repository.findByUserIdAndCourseId(
      user.id,
      course.id,
    );
    if (!courseTaken) {
      throw new NotFoundException('Course not taken by user');
    }
    return courseTaken;
  }

  @Transactional()
  public async findCompletedByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseTaken> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    const courseTaken = this.repository.findCompletedByUserIdAndCourseId(
      user.id,
      course.id,
    );
    if (!courseTaken) {
      throw new NotFoundException('Course not taken by user');
    }
    return courseTaken;
  }

  @Transactional()
  public async findCompletedWithRatingByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseTaken> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    const courseTaken = this.repository.findCompletedWithRatingByUserIdAndCourseId(
      user.id,
      course.id,
    );
    if (!courseTaken) {
      throw new NotFoundException('Course not taken by user');
    }
    return courseTaken;
  }

  public async getCompletedByUserIdAndCourseId(
    userId,
    courseId,
  ): Promise<CourseTaken> {
    return this.repository.getCompletedByUserIdAndCourseId(userId, courseId);
  }

  public async getUsersWithTakenCourses(): Promise<number> {
    return this.repository.getUsersWithTakenCourses();
  }

  public async getUsersWithCompletedCourses(): Promise<number> {
    return this.repository.getUsersWithCompletedCourses();
  }

  public async getUsersWithCompletedAndTakenCourses(): Promise<number> {
    return this.repository.getUsersWithCompletedAndTakenCourses();
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

    const currentTestSequenceNumber = courseTaken.currentTest
      ? courseTaken.currentTest.sequenceNumber
      : 1;

    completion =
      percentualPerLesson * (courseTaken.currentLesson.sequenceNumber - 1);
    completion +=
      percentualPerPart * (courseTaken.currentPart.sequenceNumber - 1);
    completion += percentualPerTest * currentTestSequenceNumber;

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
    userId: string,
    courseId: string,
  ): Promise<CertificateDTO> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);
    return this.repository.findCertificateByUserAndCourse(user, course);
  }

  @Transactional()
  public async getCertificates(user: User['id']): Promise<CertificateDTO[]> {
    return this.repository.findCertificatesByUserId(user);
  }

  @Transactional()
  public async getCoursesByFinished(
    order: OrderEnum,
    limit: number,
  ): Promise<getCoursesByFinished> {
    //executar query que rotorna o array de cursos de acordo com a ordem levando em consideração a coluna que armazena o array dos alunos que terminaram

    return this.repository.getDistinctCourses(order, limit);
  }

  async avaliateCourse(
    userId: string,
    courseId: string,
    { rating, feedback }: NpsCourseTakenDTO,
  ): Promise<void> {
    const [user, course]: [User, Course] = await Promise.all([
      this.userService.findById(userId),
      this.courseService.findById(courseId),
    ]);

    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(
      user.id,
      course.id,
    );

    if (
      courseTaken.status !== CourseTakenStatusEnum.COMPLETED ||
      courseTaken.completion !== 100
    ) {
      throw new BadRequestException('Course not finished by user');
    }

    this.publisherService.emitNpsReward(userId, courseId);
    await this.repository.save({ ...courseTaken, rating, feedback });
  }
}
