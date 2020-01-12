import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PartRepository } from '../repository';
import { Part } from '../entity';
import { PartUpdateDTO } from '../dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class PartService {

  constructor(
    private readonly repository: PartRepository,
  ) {
  }

  public async add(part: Part): Promise<Part> {

    const partSameTitle: Part = await this.repository.findByTitleAndLessonId({
      title: part.title,
      lesson: part.lesson,
    });
    if (partSameTitle) {
      throw new ConflictException();
    }

    part.sequenceNumber = 1 + await this.repository.count({ lesson: part.lesson });

    return this.repository.save(part);
  }

  @Transactional()
  public async update(id: Part['id'], partUpdatedInfo: PartUpdateDTO): Promise<Part> {
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

  public async delete(id: Part['id']): Promise<void> {
    await this.repository.delete(id);
  }

  public async findByTitle(title: Part['title'], lesson: Part['lesson']): Promise<Part> {
    const part = await this.repository.findByTitleAndLessonId({ title, lesson });
    if (!part) {
      throw new NotFoundException();
    }
    return part;
  }
}
