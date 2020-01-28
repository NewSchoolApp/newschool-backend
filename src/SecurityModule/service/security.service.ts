import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvalidClientCredentialsError } from '../exception';
import { ClientCredentials } from '../entity';
import { ClientCredentialsEnum } from '../enum';
import { classToPlain } from 'class-transformer';
import {
  FacebookAuthUserDTO,
  GeneratedTokenDTO,
  GoogleAuthUserDTO,
  RefreshTokenUserDTO,
} from '../dto';
import { UserService } from '../../UserModule/service';
import { ClientCredentialsRepository, RoleRepository } from '../repository';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../../UserModule/entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ConfigService } from '../../ConfigModule/service';

@Injectable()
export class SecurityService {
  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly appConfigService: ConfigService,
  ) {}

  @Transactional()
  public async validateClientCredentials(
    base64Login: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials: ClientCredentials = await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    return this.generateLoginObject(clientCredentials);
  }

  @Transactional()
  public decodeToken(jwt: string): ClientCredentials | User {
    return this.jwtService.verify<ClientCredentials | User>(jwt);
  }

  private splitClientCredentials(login: string): string[] {
    return login.split(':');
  }

  private base64ToString(base64Login: string): string {
    return Buffer.from(base64Login, 'base64').toString('ascii');
  }

  @Transactional()
  public async validateUserCredentials(
    base64Login: string,
    username: string,
    password: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    const user: User = await this.userService.findByEmailAndPassword(
      username,
      password,
    );
    return this.generateLoginObject(user);
  }

  public async validateFacebookUser(
    facebookAuthUser: FacebookAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const user: User = await this.userService.findByEmail(
      facebookAuthUser.email,
    );
    if (!user.facebookId) {
      user.facebookId = facebookAuthUser.id;
      const { role, ...userInfo } = user;
      const userWithFacebookId: User = await this.userService.update(
        user.id,
        userInfo,
      );
      return this.generateLoginObject(userWithFacebookId);
    }
    if (user.facebookId !== facebookAuthUser.id) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(user);
  }

  public async validateGoogleUser(
    googleAuthUser: GoogleAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const user: User = await this.userService.findByEmail(googleAuthUser.email);
    if (!user.googleSub) {
      user.googleSub = googleAuthUser.sub;
      const { role, ...userInfo } = user;
      const userWithGoogleSub: User = await this.userService.update(
        user.id,
        userInfo,
      );
      return this.generateLoginObject(userWithGoogleSub);
    }
    if (user.googleSub !== googleAuthUser.sub) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(user);
  }

  @Transactional()
  public async refreshToken(
    base64Login: string,
    refreshToken: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    let refreshTokenUser: RefreshTokenUserDTO;
    try {
      refreshTokenUser = this.getUserFromToken(refreshToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token expired');
      }
      throw error;
    }
    const { email, isRefreshToken } = refreshTokenUser;
    if (!isRefreshToken) {
      throw new UnauthorizedException('The given token is not a Refresh Token');
    }
    const user: User = await this.userService.findByEmail(email);
    return this.generateLoginObject(user);
  }

  public getUserFromToken<T extends User>(jwt: string): T {
    return this.jwtService.verify<T>(jwt);
  }

  private generateLoginObject(
    authenticatedUser: ClientCredentials | User,
  ): GeneratedTokenDTO {
    return {
      accessToken: this.jwtService.sign(classToPlain(authenticatedUser), {
        expiresIn: this.appConfigService.expiresInAccessToken,
      }),
      refreshToken: this.jwtService.sign(
        classToPlain({
          ...authenticatedUser,
          isRefreshToken: true,
        }),
        {
          expiresIn: this.appConfigService.expiresInRefreshToken,
        },
      ),
      tokenType: 'bearer',
      expiresIn: this.appConfigService.expiresInAccessToken,
    };
  }

  private async findClientCredentialsByNameAndSecret(
    name: ClientCredentialsEnum,
    secret: string,
  ): Promise<ClientCredentials> {
    if (!name) {
      throw new InvalidClientCredentialsError();
    }
    const clientCredentials: ClientCredentials = await this.clientCredentialsRepository.findByNameAndSecret(
      name,
      secret,
    );
    if (!clientCredentials) {
      throw new InvalidClientCredentialsError();
    }
    return clientCredentials;
  }
}
