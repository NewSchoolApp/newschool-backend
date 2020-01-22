import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TestRepository } from '../repository';
import { Test } from '../entity';
import { TestUpdateDTO } from '../dto';
import { TestMapper } from '../mapper';

@Injectable()
export class TestService {
  constructor(
    private readonly repository: TestRepository,
    private readonly mapper: TestMapper,
    ) {
    }

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
    console.log('testUpdatedInfo: ' + JSON.stringify(testUpdatedInfo));
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
    const test: Test = await this.repository.findOne({ id }, { relations: ['part'] });
    const deletedSequenceNum = test.sequenceNumber;
    const maxValueForTest = await this.repository.count({ part: test.part });

    if (test.sequenceNumber !== maxValueForTest){
      const tests = await (await this.repository.find({ part: test.part })).sort(this.sortByProperty('sequenceNumber'));

      await this.repository.delete({ id });
      for (let i = deletedSequenceNum; i < maxValueForTest; i++) {
        tests[i].sequenceNumber = i;
        this.update(tests[i].id, tests[i]);
      }
    }
    else{
      await this.repository.delete({ id });
    }
  }

  private sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
       return 0;  
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
    test: Test['part'] = part;
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
    test: Test['part'] = part;
    const test = await this.repository.findOne({
      part: Test['part'],
      sequenceNumber,
    });
    return test;
  }
}
