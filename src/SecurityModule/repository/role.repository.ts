import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { RoleEnum } from '../enum/role.enum';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  public async findByRoleName(name: RoleEnum): Promise<Role> {
    return this.findOne({ name });
  }
}
