import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PartRepository } from '../repository';
import { Part } from '../entity';
import { PartUpdateDTO } from '../dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MoreThan } from 'typeorm';

@Injectable()
export class PartService {
  constructor(private readonly repository: PartRepository) {}

  public async add(part: Part): Promise<Part> {
    if (!part.youtubeUrl && !part.vimeoUrl) {
      throw new BadRequestException('Part must have youtube or vimeo url');
    }

    try {
      return this.repository.save({
        ...part,
        sequenceNumber:
          1 + (await this.repository.count({ lesson: part.lesson })),
      });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Part with same title already exists');
      }
      throw new InternalServerErrorException(e.message);
    }
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
