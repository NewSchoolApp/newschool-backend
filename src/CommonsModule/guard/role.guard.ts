import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../../SecurityModule/enum';
import { User } from '../../UserModule/entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles: RoleEnum[] = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp()
      .getRequest();

    const [, token] = request.headers.authorization.split(' ');
    const user: User = this.jwtService.verify(token);
    const hasPermission: boolean = roles
      .some((role) => role === user.role);
    return user?.role && hasPermission;
  }
}
