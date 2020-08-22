import { GrantTypeEnum } from './../enum/grant-type.enum';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvalidClientCredentialsError } from '../exception/invalid-client-credentials.error';
import { ClientCredentials } from '../entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../enum/client-credentials.enum';
import { classToPlain } from 'class-transformer';
import { UserService } from '../../UserModule/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../../UserModule/entity/user.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FacebookAuthUserDTO } from '../dto/facebook-auth-user.dto';
import { ClientCredentialsRepository } from '../repository/client-credentials.repository';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';
import { GoogleAuthUserDTO } from '../dto/google-auth-user.dto';
import { RefreshTokenUserDTO } from '../dto/refresh-token-user.dto';

interface GenerateLoginObjectOptions {
  accessTokenValidity: number;
  refreshTokenValidity?: number;
}

@Injectable()
export class SecurityService {
  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async validateClientCredentials(
    base64Login: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials: ClientCredentials = await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
      GrantTypeEnum.CLIENT_CREDENTIALS,
    );
    return this.generateLoginObject(clientCredentials, {
      accessTokenValidity: clientCredentials.accessTokenValidity,
    });
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
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
      GrantTypeEnum.PASSWORD,
    );
    const user: User = await this.userService.findByEmailAndPassword(
      username,
      password,
    );
    return this.generateLoginObject(user, {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async validateFacebookUser(
    base64Login: string,
    facebookAuthUser: FacebookAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
      GrantTypeEnum.PASSWORD,
    );
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
      return this.generateLoginObject(userWithFacebookId, {
        accessTokenValidity: clientCredentials.accessTokenValidity,
        refreshTokenValidity: clientCredentials.refreshTokenValidity,
      });
    }
    if (user.facebookId !== facebookAuthUser.id) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(user, {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async validateGoogleUser(
    base64Login: string,
    googleAuthUser: GoogleAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
      GrantTypeEnum.PASSWORD,
    );
    const user: User = await this.userService.findByEmail(googleAuthUser.email);
    if (!user.googleSub) {
      user.googleSub = googleAuthUser.sub;
      const { role, ...userInfo } = user;
      const userWithGoogleSub: User = await this.userService.update(
        user.id,
        userInfo,
      );
      return this.generateLoginObject(userWithGoogleSub, {
        accessTokenValidity: clientCredentials.accessTokenValidity,
        refreshTokenValidity: clientCredentials.refreshTokenValidity,
      });
    }
    if (user.googleSub !== googleAuthUser.sub) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(user, {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
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
      GrantTypeEnum.REFRESH_TOKEN,
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
    { accessTokenValidity, refreshTokenValidity }: GenerateLoginObjectOptions,
  ): GeneratedTokenDTO {
    let loginObject: GeneratedTokenDTO = {
      accessToken: this.jwtService.sign(classToPlain(authenticatedUser), {
        expiresIn: accessTokenValidity,
      }),
      tokenType: 'bearer',
      expiresIn: accessTokenValidity,
    };
    if (refreshTokenValidity) {
      loginObject = {
        ...loginObject,
        refreshToken: this.jwtService.sign(classToPlain(authenticatedUser), {
          expiresIn: refreshTokenValidity,
        }),
      };
    }
    return loginObject;
  }

  private async findClientCredentialsByNameAndSecret(
    name: ClientCredentialsEnum,
    secret: string,
    grantType: GrantTypeEnum,
  ): Promise<ClientCredentials> {
    if (!name) {
      throw new InvalidClientCredentialsError();
    }
    const clientCredentials: ClientCredentials = await this.clientCredentialsRepository.findByNameAndSecret(
      name,
      secret,
      grantType,
    );
    if (!clientCredentials) {
      throw new InvalidClientCredentialsError();
    }
    return clientCredentials;
  }
}
