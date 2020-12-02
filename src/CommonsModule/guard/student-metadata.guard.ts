import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const UserIdParam = (userIdParam: string): CustomDecorator =>
  SetMetadata('userIdParam', userIdParam);
