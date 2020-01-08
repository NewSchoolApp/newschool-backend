import { EntityRepository, Repository, createQueryBuilder } from 'typeorm';
import { User } from '../entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email }, { relations: ['role'] });
  }

  async findByIdWithCertificates(id: string) {
    return this.findOneOrFail(id, { relations: ['certificates'] });
  }
  
  public async getCertificateByUser(userId): Promise<any[]> {
    
    return createQueryBuilder("user", "user")
    .innerJoinAndSelect("certificate_users_user", "certificate_user", "certificate_user.userId = user.id")
    .innerJoinAndSelect("certificate", "certificate", "certificate.id = certificate_user.certificateId")
    .where("user.id = :userId", {userId})
    .getRawMany();
  }
}
