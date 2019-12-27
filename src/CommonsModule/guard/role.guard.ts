import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
<<<<<<< HEAD
=======

    const authorizationHeader = request.headers.authorization;
>>>>>>> Retornando erro de jwt expirado no guarda

    if (!request.headers.authorization)
      return false;

    const [, token] = authorizationHeader.split(' ');
    let user: User;
    try {
      user = this.jwtService.verify<User>(token);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException(e.message)
      }
    }
    const hasPermission: boolean = roles
      .some((role) => role === user.role.name);
    return user?.role && hasPermission;
  }
}
