import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {

}
