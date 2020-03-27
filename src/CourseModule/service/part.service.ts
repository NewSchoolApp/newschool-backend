import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartRepository } from '../repository';
import { Lesson, Part } from '../entity';
import { NewPartDTO, PartUpdateDTO } from '../dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MoreThan } from 'typeorm';
import { LessonService } from './lesson.service';

@Injectable()
export class PartService {
  constructor(
    private readonly lessonService: LessonService,
    private readonly repository: PartRepository,
  ) {}

  public async add(part: NewPartDTO): Promise<Part> {
    if (!part.vimeoUrl && !part.youtubeUrl) {
      throw new BadRequestException('Part must have a video url');
    }

    const lesson: Lesson = await this.lessonService.findById(part.lessonId);

    const lessonSameTitle: Part = await this.repository.findByTitleAndLesson(
      part.title,
      lesson,
    );

    if (lessonSameTitle) {
      throw new ConflictException(
        'There is already a part with this title for this lesson',
      );
    }

    return this.repository.save({
      ...part,
      lesson,
      sequenceNumber: 1 + (await this.repository.count({ lesson })),
    });
  }

  @Transactional()
  public async update(
    id: Part['id'],
    partUpdatedInfo: PartUpdateDTO,
  ): Promise<Part> {
    const part: Part = await this.repository.findByIdWithLesson(id);
    if (!part) {
      throw new NotFoundException('Part not found');
    }
    const lesson =
      partUpdatedInfo.lessonId === part.lesson.id
        ? part.lesson
        : await this.lessonService.findById(partUpdatedInfo.lessonId);
    return this.repository.save({ ...part, ...partUpdatedInfo, lesson });
  }

  public async getAll(lesson: Part['lesson']): Promise<Part[]> {
    return this.repository.find({ lesson });
  }

  public async findById(id: Part['id']): Promise<Part> {
    const part: Part = await this.repository.findOne(id);
    if (!part) {
      throw new NotFoundException();
    }
    return part;
  }

  @Transactional()
  public async delete(id: Part['id']): Promise<void> {
    const deletedPart: Part = await this.repository.findOne(
      { id },
      { relations: ['lesson'] },
    );
    const partQuantity: number = await this.repository.count({
      lesson: deletedPart.lesson,
    });
    await this.repository.delete({ id });

    if (deletedPart.sequenceNumber === partQuantity) {
      return;
    }

    const parts: Part[] = await this.repository.find({
      where: {
        sequenceNumber: MoreThan(deletedPart.sequenceNumber),
      },
      order: {
        sequenceNumber: 'ASC',
      },
    });

    for (const part of parts) {
      await this.repository.save({
        ...part,
        sequenceNumber: part.sequenceNumber - 1,
      });
    }
  }

  @Transactional()
  public async countByLesson(lesson: Lesson): Promise<number> {
    return await this.repository.count({ lesson });
  }

  @Transactional()
  public async getPartIdByLessonIdAndSeqNum(
    lesson: string,
    sequenceNumber: number,
  ): Promise<Part['id']> {
    lesson: Part['lesson'] = lesson;
    const part = await this.repository.findOne({
      lesson: Part['lesson'],
      sequenceNumber,
    });
    return part.id;
  }

  @Transactional()
  public async getByLessonAndSequenceNumber(
    lesson: Lesson,
    sequenceNumber: number,
  ): Promise<Part> {
    return await this.repository.findOne({
      lesson,
      sequenceNumber,
    });
  }

  @Transactional()
  public async findPartByLessonIdAndSeqNum(
    lesson: string,
    sequenceNumber: number,
  ): Promise<Part> {
    lesson: Part['lesson'] = lesson;
    const part = await this.repository.findOne({
      lesson: Part['lesson'],
      sequenceNumber,
    });
    return part;
  }
}
