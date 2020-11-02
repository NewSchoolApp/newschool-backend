import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../../UserModule/entity/user.entity';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';

@Injectable()
export class StudentGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const userIdParam = this.reflector.get<string>(
      'userIdParam',
      context.getHandler(),
    );

    if (!userIdParam) return true;

    const request: Request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return true;

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

    if (user.role.name !== RoleEnum.STUDENT) return true;

    const userId = request.params[userIdParam];

    return userId === user.id;
  }
}
