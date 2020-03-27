import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { LessonRepository } from '../repository';
import { Course, Lesson } from '../entity';
import { LessonUpdateDTO, NewLessonDTO } from '../dto';
import { MoreThan } from 'typeorm';
import { CourseService } from './course.service';

@Injectable()
export class LessonService {
  constructor(
    private readonly courseService: CourseService,
    private readonly repository: LessonRepository,
  ) {}

  @Transactional()
  public async add(lesson: NewLessonDTO): Promise<Lesson> {
    const course: Course = await this.courseService.findById(lesson.courseId);
    const lessonSameTitle: Lesson = await this.repository.findByTitleAndCourse(
      lesson.title,
      course,
    );

    if (lessonSameTitle) {
      throw new ConflictException(
        'There is already a lesson with this title for this course',
      );
    }

    return this.repository.save({
      ...lesson,
      course,
      sequenceNumber: 1 + (await this.repository.count({ course: course })),
    });
  }

  @Transactional()
  public async update(
    id: Lesson['id'],
    lessonUpdatedInfo: LessonUpdateDTO,
  ): Promise<Lesson> {
    const lesson: Lesson = await this.repository.findByIdWithCourse(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    const course =
      lessonUpdatedInfo.courseId === lesson.course.id
        ? lesson.course
        : await this.courseService.findById(lessonUpdatedInfo.courseId);
    return this.repository.save({
      ...lesson,
      ...lessonUpdatedInfo,
      course,
    });
  }

  @Transactional()
  public async getAll(courseId: Course['id']): Promise<Lesson[]> {
    const course: Course = await this.courseService.findById(courseId);
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
    const deletedLesson: Lesson = await this.repository.findOne(
      { id },
      { relations: ['course'] },
    );
    const lessonQuantity: number = await this.repository.count({
      course: deletedLesson.course,
    });
    await this.repository.delete({ id });
    if (deletedLesson.sequenceNumber === lessonQuantity) {
      return;
    }

    const lessons: Lesson[] = await this.repository.find({
      where: {
        sequenceNumber: MoreThan(deletedLesson),
      },
      order: {
        sequenceNumber: 'ASC',
      },
    });
    for (const lesson of lessons) {
      await this.repository.save({
        ...lesson,
        sequenceNumber: lesson.sequenceNumber - 1,
      });
    }
  }

  @Transactional()
  public async countByCourse(course: Course): Promise<number> {
    return await this.repository.count({ course });
  }

  @Transactional()
  public async getByCourseAndSequenceNumber(
    course: Course,
    sequenceNumber: number,
  ): Promise<Lesson> {
    return await this.repository.findOne({ course, sequenceNumber });
  }
}
