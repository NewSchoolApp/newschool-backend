import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email }, { relations: ['role'] });
  }

  async findByIdWithCertificates(id: string): Promise<User | undefined> {
    return this.findOneOrFail(id, { relations: ['certificates'] });
  }

  async findByIdWithCourses(id: string): Promise<User | undefined> {
    const teste = await this.findOneOrFail(id, { relations: ['createdCourses'] });
    return this.findOneOrFail(id, { relations: ['createdCourses'] });
  }
}
