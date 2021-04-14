import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const NeedRoles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

export const NeedPolicies = (...policies: string[]): CustomDecorator =>
  SetMetadata('policies', policies);
