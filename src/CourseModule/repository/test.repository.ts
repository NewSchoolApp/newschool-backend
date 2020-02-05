import { EntityRepository, Repository } from 'typeorm';
import { Part, Test } from '../entity';

@EntityRepository(Test)
export class TestRepository extends Repository<Test> {
  async findById({ id }): Promise<Test | undefined> {
    return this.findOne({ id });
  }

  async findByIdWithPart(id: string): Promise<Test | undefined> {
    return this.findOne({ id }, { relations: ['part'] });
  }

  async findByTitleAndPartId(
    title: string,
    part: Part,
  ): Promise<Test | undefined> {
    return this.findOne({ title, part });
  }
}
