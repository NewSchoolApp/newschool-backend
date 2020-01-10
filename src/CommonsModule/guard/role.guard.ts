import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader)
      return false;

    const [, token] = authorizationHeader.split(' ');
    let user: User;
    try {
      user = this.jwtService.verify<User>(token);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException(e.message);
      }
      throw new InternalServerErrorException(e);
    }
    const hasPermission: boolean = roles
      .some((role) => role === user.role.name);
    return user?.role && hasPermission;
  }
}
