import { EntityRepository, Repository } from 'typeorm';
import { ChangePassword } from '../entity';

@EntityRepository(ChangePassword)
export class ChangePasswordRepository extends Repository<ChangePassword> {}
