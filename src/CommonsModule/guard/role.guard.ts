import {
  CanActivate,
  ExecutionContext,
  HttpService,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../UserModule/entity/user.entity';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return false;

    let user: User;
    try {
      const { data } = await this.httpService
        .post(this.configService.securityOauthTokenDetailsUrl, null, {
          headers: { authorization: authorizationHeader },
        })
        .toPromise();
      user = data;
    } catch (e) {
      throw new UnauthorizedException(e.data);
    }
    const hasPermission: boolean = roles.some(
      (role) =>
        role === user.role?.name ||
        role === user.role?.slug ||
        user.role?.policies?.some(
          (policy) => policy?.name === role || policy?.slug === role,
        ),
    );
    return user?.role && hasPermission;
  }
}
