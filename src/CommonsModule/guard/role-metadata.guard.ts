import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const NeedRole = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);
