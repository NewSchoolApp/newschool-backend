import { EntityRepository, Repository } from 'typeorm';
import { Test } from '../entity';

@EntityRepository(Test)
export class TestRepository extends Repository<Test> {

  async findByTitle({ title, part }): Promise<Test | undefined> {
    return this.findByTitleAndPartId({ title, part });
  }

  async findById({ id }): Promise<Test | undefined> {
    return this.findOne({ id });
  }

  async findByTitleAndPartId({ title, part }): Promise<Test | undefined> {
    return this.findOne({ title, part });
  }
}
