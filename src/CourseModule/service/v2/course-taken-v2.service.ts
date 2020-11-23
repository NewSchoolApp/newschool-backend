import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CmsIntegration } from '../../integration/cms.integration';
import { CourseTakenRepository } from '../../repository/course.taken.repository';
import { CourseTaken } from '../../entity/course.taken.entity';
import { CourseTakenStatusEnum } from '../../enum/enum';
import { AxiosResponse } from 'axios';
import { CMSLessonDTO } from '../../dto/cms-lesson.dto';
import { CMSTestDTO } from '../../dto/cms-test.dto';
import { PublisherService } from '../../../GameficationModule/service/publisher.service';

@Injectable()
export class CourseTakenV2Service {
  @Inject(PublisherService)
  private readonly publisherService: PublisherService;

  constructor(
    private readonly cmsIntegration: CmsIntegration,
    private readonly repository: CourseTakenRepository,
  ) {}

  public async getAllByUserId(userId: string): Promise<CourseTaken[]> {
    return await this.repository.findByUserId(userId);
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
    );

    const currentTest: CMSTestDTO = tests.find((test) => test.id);
    const nextTestOrderNumber = currentTest.ordem + 1;
    const nextTest: CMSTestDTO = tests.find(
      (test) => test.ordem === nextTestOrderNumber,
    );

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
      CMSLessonDTO[]
    > = await this.cmsIntegration.getPartsByLessonId(
      courseTaken.currentLessonId,
    );

    const currentPart: CMSLessonDTO = parts.find((part) => part.id);
    const nextPartOrderNumber = currentPart.ordem + 1;
    const nextPart: CMSLessonDTO = parts.find(
      (part) => part.ordem === nextPartOrderNumber,
    );

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
    > = await this.cmsIntegration.getLessonsByCourseId(courseTaken.courseId);

    const currentLesson: CMSLessonDTO = lessons.find((lesson) => lesson.id);
    const nextLessonOrderNumber = currentLesson.ordem + 1;
    const nextLesson: CMSLessonDTO = lessons.find(
      (lesson) => lesson.ordem === nextLessonOrderNumber,
    );

    if (nextLesson) {
      const updatedCourseTaken = {
        ...courseTaken,
        currentTestId: null,
        currentPartId: nextLesson.partes[0].id,
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

  public async currentStep(userId: string, courseId: number) {
    const courseTaken = await this.findByUserIdAndCourseId(userId, courseId);
    if (!courseTaken.currentTestId) {
      const { data: part } = await this.cmsIntegration.findPartById(
        courseTaken.currentPartId,
      );
      return {
        doing: 'PART',
        part,
      };
    }
    const {
      data: test,
    }: AxiosResponse<CMSTestDTO> = await this.cmsIntegration.findTestById(
      courseTaken.currentTestId,
    );
    const { alternativa_certa: alternativeCerta, ...rest } = test;
    return {
      doing: 'TEST',
      test: rest,
    };
  }

  private async calculateCompletion(courseTaken: CourseTaken): Promise<number> {
    if (courseTaken.status === CourseTakenStatusEnum.COMPLETED) {
      return 100;
    }

    const [
      { data: lessons },
      { data: parts },
      { data: tests },
    ] = await Promise.all([
      this.cmsIntegration.getLessonsByCourseId(courseTaken.courseId),
      this.cmsIntegration.getPartsByLessonId(courseTaken.currentLessonId),
      this.cmsIntegration.getLessonsByCourseId(courseTaken.currentPartId),
    ]);

    const lessonsQuantity = lessons.length;
    const partsQuantity = parts.length;
    const testsQuantity = tests.length;

    let completion: number;

    const percentualPerLesson = 100 / lessonsQuantity;
    const percentualPerPart = percentualPerLesson / partsQuantity;
    const percentualPerTest = percentualPerPart / testsQuantity;

    const currentLesson = lessons.find(
      (test) => test.id === courseTaken.currentLessonId,
    );
    const currentPart = parts.find(
      (test) => test.id === courseTaken.currentPartId,
    );
    const currentTest = tests.find(
      (test) => test.id === courseTaken.currentTestId,
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
