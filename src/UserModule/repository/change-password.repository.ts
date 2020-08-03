import { EntityRepository, Repository } from 'typeorm';
import { ChangePassword } from '../entity/change-password.entity';

@EntityRepository(ChangePassword)
export class ChangePasswordRepository extends Repository<ChangePassword> {}
