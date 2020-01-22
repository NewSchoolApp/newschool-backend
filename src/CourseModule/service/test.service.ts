import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TestRepository } from '../repository';
import { Test } from '../entity';
import { TestUpdateDTO } from '../dto';
import { MoreThan } from 'typeorm';

@Injectable()
export class TestService {
  constructor(private readonly repository: TestRepository) {}

  @Transactional()
  public async add(test: Test): Promise<Test> {
    const testSameTitle: Test = await this.repository.findByTitleAndPartId({
      title: test.title,
      part: test.part,
    });
    if (testSameTitle) {
      throw new ConflictException(
        'There is already a test with this title for this part',
      );
    }

    test.sequenceNumber =
      1 + (await this.repository.count({ part: test.part }));

    return this.repository.save(test);
  }

  @Transactional()
  public async update(
    id: Test['id'],
    testUpdatedInfo: TestUpdateDTO,
  ): Promise<Test> {
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
    const deletedTest: Test = await this.repository.findOne(
      { id },
      { relations: ['part'] },
    );
    const testQuantity: number = await this.repository.count({
      part: deletedTest.part,
    });
    await this.repository.delete({ id });

    if (deletedTest.sequenceNumber === testQuantity) {
      return;
    }

    const tests: Test[] = await this.repository.find({
      where: {
        sequenceNumber: MoreThan(deletedTest.sequenceNumber),
      },
      order: {
        sequenceNumber: 'ASC',
      },
    });

    for (const test of tests) {
      await this.repository.save({
        ...test,
        sequenceNumber: test.sequenceNumber - 1,
      });
    }
  }

  @Transactional()
  public async findByTitle(
    title: Test['title'],
    part: Test['part'],
  ): Promise<Test> {
    const test = await this.repository.findByTitleAndPartId({ title, part });
    if (!test) {
      throw new NotFoundException('No test found');
    }
    return test;
  }

  @Transactional()
  public async checkTest(
    id: Test['id'],
    chosenAlternative: string,
  ): Promise<boolean> {
    const test = await this.repository.findById({ id });
    if (!test) {
      throw new NotFoundException('No test found');
    }

    return test.correctAlternative === chosenAlternative ? true : false;
  }

  @Transactional()
  public async getMaxValueForTest(part: string): Promise<number> {
    return await this.repository.count({ part: Test['part'] });
  }

  @Transactional()
  public async getTestIdByPartIdAndSeqNum(
    part: string,
    sequenceNumber: number,
  ): Promise<Test['id']> {
    part: Test['part'] = part;
    const test = await this.repository.findOne({
      part: Test['part'],
      sequenceNumber,
    });
    return test.id;
  }

  @Transactional()
  public async findTestByPartIdAndSeqNum(
    part: string,
    sequenceNumber: number,
  ): Promise<Test> {
    part: Test['part'] = part;
    const test = await this.repository.findOne({
      part: Test['part'],
      sequenceNumber,
    });
    return test;
  }
}
