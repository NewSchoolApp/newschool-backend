import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email }, { relations: ['role'] });
  }

  async findByIdWithCertificates(id: string) {
    return this.findOneOrFail(id, { relations: ['certificates'] });
  }
  
  async addPointToUser(userId: string, points: number) {
    throw new NotImplementedException();
  }
}
