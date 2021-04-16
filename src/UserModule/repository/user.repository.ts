import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email }, { relations: ['role', 'role.policies'] });
  }

  async findByIdWithCertificates(id: string): Promise<User | undefined> {
    return this.findOneOrFail(id, { relations: ['certificates'] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCertificateByUser(userId: string): Promise<any[]> {
    return createQueryBuilder('user', 'user')
      .innerJoinAndSelect(
        'certificate_users_user',
        'certificate_user',
        'certificate_user.userId = user.id',
      )
      .innerJoinAndSelect(
        'certificate',
        'certificate',
        'certificate.id = certificate_user.certificateId',
      )
      .where('user.id = :userId', { userId })
      .getRawMany();
  }

  async findByIdWithCourses(id: string): Promise<User | undefined> {
    return this.findOneOrFail(id, { relations: ['createdCourses'] });
  }

  async findByEmailAndFacebookId(
    email: string,
    facebookId: string,
  ): Promise<User> {
    return this.findOne({ email, facebookId });
  }

  getUsersQuantity(): Promise<number> {
    return this.count();
  }

  // #TODO: Criar lógica de usuários ativos
  getActiveUsersQuantity(): Promise<number> {
    return this.count();
  }

  // #TODO: Criar lógica de usuários inativos
  getInactiveUsersQuantity(): Promise<number> {
    return this.count();
  }

  async findByInviteKey(inviteKey: string): Promise<User> {
    const response = await this.find({ where: { inviteKey } });
    return response[0];
  }

  public async countUsersInvitedByUserId(id: string): Promise<number> {
    return this.count({ where: { invitedByUserId: { id } } });
  }
}
