import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CourseTakenRepository } from '../../repository/course.taken.repository';
import { CourseTaken } from '../../entity/course-taken.entity';
import { CourseTakenStatusEnum } from '../../enum/course-taken-status.enum';
import { AxiosResponse } from 'axios';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';
import { PublisherService } from '../../../GameficationModule/service/publisher.service';
import { CMSPartDTO } from '../../dto/cms-part.dto';
import {
  CurrentStepDoingEnum,
  CurrentStepDTO,
} from '../../dto/current-step.dto';
import { NpsCourseTakenDTO } from '../../dto/nps-course-taken.dto';
import { ChallengeDTO } from '../../../GameficationModule/dto/challenge.dto';
import { Pageable, PageableDTO } from '../../../CommonsModule/dto/pageable.dto';
import { UserMapper } from '../../../UserModule/mapper/user.mapper';
import { CourseTakenDTO } from '../../dto/course-taken.dto';

@Injectable()
export class CourseTakenV2Service {
  private readonly logger = new Logger(CourseTakenV2Service.name);

  constructor(
    private readonly cmsIntegration: CmsIntegration,
    private readonly repository: CourseTakenRepository,
    private readonly publisherService: PublisherService,
    private readonly userMapper: UserMapper,
  ) {}

  public async getAllByUserId(userId: string): Promise<CourseTaken[]> {
    return await this.repository.findByUserId(userId);
  }

  public async startCourse(userId: string, courseId: number): Promise<void> {
    const {
      data: lessons,
    }: AxiosResponse<
      CMSLessonDTO[]
    > = await this.cmsIntegration.getLessonsByCourseId(courseId, {
      _sort: 'ordem:asc',
    });
    const firstLesson = lessons[0];

    const { data: parts } = await this.cmsIntegration.getPartsByLessonId(
      firstLesson.id,
      {
        _sort: 'ordem:asc',
      },
    );
    const firstPart = parts[0];

    try {
      await this.repository.save({
        userId,
        courseId,
        currentLessonId: firstLesson.id,
        currentPartId: firstPart.id,
        currentTestId: null,
        status: CourseTakenStatusEnum.TAKEN,
        completion: 0,
      });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User is already enrolled in this course');
      }
      this.logger.log(e);
      throw new InternalServerErrorException();
    }
  }

  public async advanceOnCourse(
    userId: string,
    courseId: number,
  ): Promise<void> {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(
      userId,
      courseId,
    );
    if (
      courseTaken.completion === 100 &&
      courseTaken.status === CourseTakenStatusEnum.COMPLETED
    )
      return;

    const {
      data: tests,
    }: AxiosResponse<CMSTestDTO[]> = await this.cmsIntegration.getTestsByPartId(
      courseTaken.currentPartId,
      {
        _sort: 'ordem:asc',
      },
    );

    const currentTest: CMSTestDTO = tests.find(
      (test) => test.id == courseTaken.currentTestId,
    );

    const nextTest: CMSTestDTO = tests.filter(
      (test) => test.ordem > currentTest?.ordem ?? 0,
    )[0];

    if (nextTest) {
      const updatedCourseTaken = { ...courseTaken, currentTestId: nextTest.id };
      updatedCourseTaken.completion = await this.calculateCompletion(
        updatedCourseTaken,
      );
      await this.repository.save(updatedCourseTaken);
      return;
    }

    const {
      data: parts,
    }: AxiosResponse<
      CMSPartDTO[]
    > = await this.cmsIntegration.getPartsByLessonId(
      courseTaken.currentLessonId,
      { _sort: 'ordem:asc' },
    );

    const currentPart: CMSPartDTO = parts.find(
      (part) => part.id == courseTaken.currentPartId,
    );

    const nextPart: CMSPartDTO = parts.find(
      (part) => part.ordem > currentPart.ordem,
    )[0];

    if (nextPart) {
      const updatedCourseTaken = {
        ...courseTaken,
        currentTestId: null,
        currentPartId: nextPart.id,
      };
      updatedCourseTaken.completion = await this.calculateCompletion(
        updatedCourseTaken,
      );
      await this.repository.save(updatedCourseTaken);
      return;
    }

    const {
      data: lessons,
    }: AxiosResponse<
      CMSLessonDTO[]
    > = await this.cmsIntegration.getLessonsByCourseId(courseTaken.courseId, {
      _sort: 'ordem:asc',
    });

    const currentLesson: CMSLessonDTO = lessons.find(
      (lesson) => lesson.id == courseTaken.currentLessonId,
    );

    const nextLesson: CMSLessonDTO = lessons.find(
      (lesson) => lesson.ordem > currentLesson.ordem,
    )[0];

    if (nextLesson) {
      const updatedCourseTaken = {
        ...courseTaken,
        currentTestId: null,
        currentPartId: nextLesson.partes.find((parte) => parte.ordem == 1).id,
        currentLessonId: nextLesson.id,
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
      courseCompleteDate: new Date(Date.now()),
    });
    this.publisherService.emitCourseCompleted(courseTaken);
  }

  public async avaliateCourse(
    userId: string,
    courseId: number,
    { rating, feedback }: NpsCourseTakenDTO,
  ): Promise<void> {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (
      courseTaken.status !== CourseTakenStatusEnum.COMPLETED ||
      courseTaken.completion !== 100
    ) {
      throw new BadRequestException('Course not finished by user');
    }

    await this.repository.save({ ...courseTaken, rating, feedback });
    this.publisherService.emitNpsReward(userId, courseId);
  }

  public async sendChallenge(
    userId: string,
    courseId: number,
    data: ChallengeDTO,
  ): Promise<CourseTaken> {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(
      userId,
      courseId,
    );
    const { challenge } = data;

    const payloadToInsert = {
      ...courseTaken,
      challenge,
    };
    return await this.repository.save(payloadToInsert);
  }

  public async findChallenges(
    courseId: string,
    { limit, page }: { limit: number; page: number },
  ): Promise<Pageable<CourseTakenDTO>> {
    const challengesPaginated: PageableDTO<CourseTaken> = await this.repository.findChallengesByCourseIdPaginated(
      courseId,
      {
        limit,
        page,
      },
    );

    return {
      ...challengesPaginated,
      content: await Promise.all(
        challengesPaginated.content.map(async (challenge) => {
          return {
            ...challenge,
            user: await this.userMapper.toDtoAsync(challenge.user),
          };
        }),
      ),
    };
  }

  private async findByUserIdAndCourseId(
    userId: string,
    courseId: number,
  ): Promise<CourseTaken> {
    const courseTaken = await this.repository.findByUserIdAndCourseId(
      userId,
      courseId,
    );
    if (!courseTaken) {
      throw new NotFoundException('User have not started this course');
    }
    return courseTaken;
  }

  public async currentStep(
    userId: string,
    courseId: number,
  ): Promise<CurrentStepDTO> {
    const courseTaken = await this.findByUserIdAndCourseId(userId, courseId);

    if (
      !courseTaken.challenge &&
      courseTaken.status === CourseTakenStatusEnum.COMPLETED &&
      courseTaken.completion === 100
    ) {
      return {
        doing: CurrentStepDoingEnum.CHALLENGE,
      };
    }

    if (
      courseTaken.challenge &&
      courseTaken.status === CourseTakenStatusEnum.COMPLETED &&
      courseTaken.completion === 100
    ) {
      return {
        doing: CurrentStepDoingEnum.COMPLETED,
      };
    }

    if (!courseTaken.currentTestId) {
      const { data: part } = await this.cmsIntegration.findPartById(
        courseTaken.currentPartId,
      );
      return {
        doing: CurrentStepDoingEnum.PART,
        part,
      };
    }
    const {
      data: test,
    }: AxiosResponse<CMSTestDTO> = await this.cmsIntegration.findTestById(
      courseTaken.currentTestId,
    );
    const { alternativa_certa: rightAlternative, ...rest } = test;
    return {
      doing: CurrentStepDoingEnum.TEST,
      test: rest,
    };
  }

  public async getCertificates(userId: string) {
    const coursesTaken: CourseTaken[] = await this.repository.findFinishedCoursesByUserId(
      userId,
    );
    const coursesId: number[] = coursesTaken.reduce(
      (acc: number[], courseTaken) => [...acc, courseTaken.courseId],
      [],
    );
    const { data: courses } = await this.cmsIntegration.getCourses({
      queryString: { id: coursesId },
    });
    return coursesTaken.map((courseTaken) => ({
      ...courseTaken,
      course: courses.find((course) => course.id === courseTaken.courseId),
    }));
  }

  public async getCertificate(userId: string, courseId: number) {
    const courseTaken: CourseTaken = await this.findByUserIdAndCourseId(
      userId,
      courseId,
    );
    const { data: course } = await this.cmsIntegration.findCourseById(courseId);
    return {
      ...courseTaken,
      course,
    };
  }

  private async calculateCompletion(courseTaken: CourseTaken): Promise<number> {
    if (courseTaken.status === CourseTakenStatusEnum.COMPLETED) {
      return 100;
    }

    const [{ data: lessons }, { data: parts }, { data: tests }]: (
      | AxiosResponse<CMSLessonDTO[]>
      | AxiosResponse<CMSPartDTO[]>
      | AxiosResponse<CMSTestDTO[]>
    )[] = await Promise.all([
      this.cmsIntegration.getLessonsByCourseId(courseTaken.courseId),
      this.cmsIntegration.getPartsByLessonId(courseTaken.currentLessonId),
      this.cmsIntegration.getTestsByPartId(courseTaken.currentPartId),
    ]);

    const lessonsQuantity = lessons.length;
    const partsQuantity = parts.length;
    const testsQuantity = tests.length;

    let completion: number;

    const percentualPerLesson = 100 / lessonsQuantity;
    const percentualPerPart = percentualPerLesson / partsQuantity;
    const percentualPerTest = percentualPerPart / testsQuantity;

    const currentLesson = lessons.find(
      (lesson) => lesson.id == courseTaken.currentLessonId,
    );
    const currentPart = parts.find(
      (part) => part.id == courseTaken.currentPartId,
    );
    const currentTest = tests.find(
      (test) => test.id == courseTaken.currentTestId,
    );

    const currentTestSequenceNumber = courseTaken.currentTestId
      ? currentTest.ordem
      : 1;

    completion = percentualPerLesson * (currentLesson.ordem - 1);
    completion += percentualPerPart * (currentPart.ordem - 1);
    completion += percentualPerTest * currentTestSequenceNumber;

    return completion > 100 ? 100 : completion;
  }
}
