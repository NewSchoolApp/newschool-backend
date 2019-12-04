import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../../SecurityModule/enum';
import { User } from '../../UserModule/entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles: RoleEnum[] = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp()
      .getRequest();

    const user: User = request.user;
    const hasPermission: boolean = roles.some((role) => role === user.role);
    return user?.role && hasPermission;
  }
}
