import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';

export const NeedRole = (...roles: RoleEnum[]): CustomDecorator =>
  SetMetadata('roles', roles);
