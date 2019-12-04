import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../SecurityModule/enum';

export const NeedRole = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
