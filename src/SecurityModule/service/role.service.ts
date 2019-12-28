import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleEnum } from '../enum';
import { RoleRepository } from '../repository';
import { Role } from '../entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly repository: RoleRepository,
  ) {
  }

  public async findByRoleName(name: RoleEnum): Promise<Role> {
    const role: Role = await this.repository.findByRoleName(name);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

}
