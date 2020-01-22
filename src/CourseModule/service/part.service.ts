import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartRepository } from '../repository';
import { Part } from '../entity';
import { PartUpdateDTO } from '../dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class PartService {
  constructor(private readonly repository: PartRepository) {}

  public async add(part: Part): Promise<Part> {
    const partSameTitle: Part = await this.repository.findByTitleAndLessonId({
      title: part.title,
      lesson: part.lesson,
    });
    if (partSameTitle) {
      throw new ConflictException();
    }

    part.sequenceNumber =
      1 + (await this.repository.count({ lesson: part.lesson }));

    return this.repository.save(part);
  }

  @Transactional()
  public async update(
    id: Part['id'],
    partUpdatedInfo: PartUpdateDTO,
  ): Promise<Part> {
    const part: Part = await this.findById(id);
    return this.repository.save({ ...part, ...partUpdatedInfo });
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
    const part: Part = await this.repository.findOne(
      { id },
      { relations: ['lesson'] },
    );
    const deletedSequenceNum = part.sequenceNumber;
    const maxValueForPart = await this.repository.count({
      lesson: part.lesson,
    });
    await this.repository.delete({ id });

    if (part.sequenceNumber === maxValueForPart) {
      return;
    }

    const parts = await this.repository.find({
      where: {
        lesson: part.lesson,
      },
      order: {
        sequenceNumber: 'ASC',
      },
    });

    for (let i = deletedSequenceNum; i < maxValueForPart; i++) {
      await this.repository.save({ ...parts[i], sequenceNumber: i });
    }
  }

  private sortByProperty(property) {
    return function(a, b) {
      if (a[property] > b[property]) {
        return 1;
      } else if (a[property] < b[property]) {
        return -1;
      }
      return 0;
    };
  }

  public async findByTitle(
    title: Part['title'],
    lesson: Part['lesson'],
  ): Promise<Part> {
    const part = await this.repository.findByTitleAndLessonId({
      title,
      lesson,
    });
    if (!part) {
      throw new NotFoundException();
    }
    return part;
  }

  @Transactional()
  public async getMaxValueForPart(lesson: string): Promise<number> {
    return await this.repository.count({ lesson: Part['lesson'] });
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
