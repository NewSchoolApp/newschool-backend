import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TestRepository } from '../repository';
import { Test } from '../entity';
import { TestUpdateDTO } from '../dto';

@Injectable()
export class TestService {

  constructor(
    private readonly repository: TestRepository,
  ) {
  }

  @Transactional()
  public async add(test: Test): Promise<Test> {

    const testSameTitle: Test = await this.repository.findByTitleAndPartId({ title: test.title, part: test.part });
    if (testSameTitle) {
      throw new ConflictException('There is already a test with this title for this part');
    }

    test.sequenceNumber = 1 + await this.repository.count({ part: test.part });

    return this.repository.save(test);
  }

  @Transactional()
  public async update(id: Test['id'], testUpdatedInfo: TestUpdateDTO): Promise<Test> {
    const test: Test = await this.findById(id);
    return this.repository.save({ ...test, ...testUpdatedInfo });
  }

  @Transactional()
  public async getAll(part: Test['part']): Promise<Test[]> {
    return this.repository.find({ part });
  }

  @Transactional()
  public async findById(id: Test['id']): Promise<Test> {
    const test: Test = await this.repository.findOne({ id });
    if (!test) {
      throw new NotFoundException('No test found');
    }
    return test;
  }

  @Transactional()
  public async delete(id: Test['id']): Promise<void> {
    await this.repository.delete({ id });
  }

  @Transactional()
  public async findByTitle(title: Test['title'], part: Test['part']): Promise<Test> {
    const test = await this.repository.findByTitleAndPartId({ title, part });
    if (!test) {
      throw new NotFoundException('No test found');
    }
    return test;
  }
}
