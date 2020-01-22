import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { LessonRepository } from '../repository';
import { Lesson } from '../entity';
import { LessonUpdateDTO } from '../dto';
import { LessonMapper } from '../mapper';

@Injectable()
export class LessonService {
  constructor(
    private readonly repository: LessonRepository,
    private readonly mapper: LessonMapper,
    ) {
    }

  @Transactional()
  public async add(lesson: Lesson): Promise<Lesson> {
    const lessonSameTitle: Lesson = await this.repository.findByTitleAndCourseId(
      {
        title: lesson.title,
        course: lesson.course,
      },
    );
    if (lessonSameTitle) {
      throw new ConflictException();
    }

    const lessonCount = await this.repository.count({ course: lesson.course });
    // eslint-disable-next-line require-atomic-updates
    lesson.sequenceNumber = lessonCount + 1;

    return this.repository.save(lesson);
  }

  @Transactional()
  public async update(
    id: Lesson['id'],
    lessonUpdatedInfo: LessonUpdateDTO,
  ): Promise<Lesson> {
    const lesson: Lesson = await this.findById(id);
    console.log('on update method: lesson: ' + JSON.stringify(lesson) + ' lessonUpdatedInfo: ' + JSON.stringify(lessonUpdatedInfo));
    return this.repository.save({ ...lesson, ...lessonUpdatedInfo });
  }

  @Transactional()
  public async getAll(course: Lesson['course']): Promise<Lesson[]> {
    return this.repository.find({ course });
  }

  @Transactional()
  public async findById(id: Lesson['id']): Promise<Lesson> {
    const lesson: Lesson = await this.repository.findOne({ id });
    if (!lesson) {
      throw new NotFoundException();
    }
    return lesson;
  }

  @Transactional()
  public async delete(id: Lesson['id']): Promise<void> {
    await this.repository.delete({ id });
  }

  @Transactional()
  public async findByTitle(
    title: Lesson['title'],
    course: Lesson['course'],
  ): Promise<Lesson> {
    const lesson = await this.repository.findByTitleAndCourseId({
      title,
      course,
    });
    if (!lesson) {
      throw new NotFoundException();
    }
    return lesson;
  }

  @Transactional()
  public async getMaxValueForLesson(course: Lesson['course']): Promise<number> {
    return await this.repository.count({ course });
  }

  @Transactional()
  public async getLessonIdByCourseIdAndSeqNum(
    course: Lesson['course'],
    sequenceNumber: number,
  ): Promise<Lesson['id']> {
    const lesson = await this.repository.findOne({ course, sequenceNumber });
    return lesson.id;
  }

  @Transactional()
  public async findLessonByCourseIdAndSeqNum(
    course: Lesson['course'],
    sequenceNumber: number,
  ): Promise<Lesson> {
    const lesson = await this.repository.findOne({ course, sequenceNumber });
    return lesson;
  }
}
