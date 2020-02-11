import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { RoleEnum } from '../../SecurityModule/enum';

export const NeedRole = (...roles: RoleEnum[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
