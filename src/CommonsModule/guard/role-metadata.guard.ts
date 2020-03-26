import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';

export const NeedRole = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
