import { GrantTypeEnum } from '../enum/grant-type.enum';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { InvalidClientCredentialsError } from '../exception/invalid-client-credentials.error';
import { ClientCredentials } from '../entity/client-credentials.entity';
import { classToPlain } from 'class-transformer';
import { UserService } from '../../UserModule/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../../UserModule/entity/user.entity';
import { FacebookAuthUserDTO } from '../dto/facebook-auth-user.dto';
import { ClientCredentialsRepository } from '../repository/client-credentials.repository';
import { GeneratedTokenDTO } from '../dto/generated-token.dto';
import { GoogleAuthUserDTO } from '../dto/google-auth-user.dto';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { UserMapper } from '../../UserModule/mapper/user.mapper';
import { UserDTO } from '../../UserModule/dto/user.dto';
import { SecurityIntegration } from '../integration/security.integration';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const securePassword = require('secure-password');

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
    private readonly configService: ConfigService,
    private readonly userMapper: UserMapper,
    private readonly securityIntegration: SecurityIntegration,
  ) {}

  hashPaths: {
    // @ts-ignore
    [key: symbol]: (params: { user: User; password: string }) => Promise<User>;
  } = {
    [securePassword.INVALID_UNRECOGNIZED_HASH]: async ({ user, password }) => {
      const isValidPassword = user.validPassword(password);
      if (!isValidPassword)
        throw new NotFoundException(
          'User with this email or password not found',
        );
      return user;
    },
    [securePassword.INVALID]: async () => {
      throw new NotFoundException('User with this email or password not found');
    },
    [securePassword.VALID_NEEDS_REHASH]: async ({ user }) => {
      return user;
    },
    [securePassword.VALID]: async ({ user }) => {
      return user;
    },
  };

  public async validateClientCredentials(
    base64Login: string,
  ): Promise<GeneratedTokenDTO> {
    const {
      data: token,
    } = await this.securityIntegration.clientCredentialsLogin({ base64Login });
    return token;
  }

  public decodeToken(jwt: string): ClientCredentials | User {
    return this.jwtService.verify<ClientCredentials | User>(jwt);
  }

  private splitClientCredentials(login: string): string[] {
    return login.split(':');
  }

  private base64ToString(base64Login: string): string {
    return Buffer.from(base64Login, 'base64').toString('ascii');
  }

  public async validateUserCredentials(
    base64Login: string,
    username: string,
    password: string,
  ): Promise<GeneratedTokenDTO> {
    try {
      const axiosResponse = await this.securityIntegration.userLogin({
        username,
        password,
        base64Login,
      });
      return axiosResponse.data;
    } catch (e) {
      console.log('to no catch');
      const user: User = await this.userService.findByEmail(username);
      console.log('user', user);
      const result = await user.validPasswordv2(password);
      console.log('result', result);
      await this.hashPaths[result]({
        user,
        password,
      });
      const {
        data: securityStudent,
      } = await this.securityIntegration.addNewStudent({ username, password });
      console.log('securityStudent', securityStudent);
      const { data: token } = await this.securityIntegration.userLogin({
        username,
        password,
        base64Login,
      });
      await this.userService.update(user.id, {
        id: securityStudent.id,
        password: '',
      } as any);
      return token;
    }
  }

  public async validateFacebookUser(
    base64Login: string,
    facebookAuthUser: FacebookAuthUserDTO,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
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
      return this.generateLoginObject(
        this.userMapper.toDto(userWithFacebookId),
        {
          accessTokenValidity: clientCredentials.accessTokenValidity,
          refreshTokenValidity: clientCredentials.refreshTokenValidity,
        },
      );
    }
    if (user.facebookId !== facebookAuthUser.id) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(this.userMapper.toDto(user), {
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
      name,
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
      return this.generateLoginObject(
        this.userMapper.toDto(userWithGoogleSub),
        {
          accessTokenValidity: clientCredentials.accessTokenValidity,
          refreshTokenValidity: clientCredentials.refreshTokenValidity,
        },
      );
    }
    if (user.googleSub !== googleAuthUser.sub) {
      throw new NotFoundException('User not found');
    }
    return this.generateLoginObject(this.userMapper.toDto(user), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public async refreshToken(
    base64Login: string,
    refreshToken: string,
  ): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    const clientCredentials = await this.findClientCredentialsByNameAndSecret(
      name,
      secret,
      GrantTypeEnum.REFRESH_TOKEN,
    );
    let refreshTokenUser: User;
    try {
      refreshTokenUser = this.getUserFromToken(
        refreshToken,
        this.configService.refreshTokenSecret,
      );
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token expired');
      }
      throw new UnauthorizedException();
    }
    const user: User = await this.userService.findByEmail(
      refreshTokenUser.email,
    );
    return this.generateLoginObject(this.userMapper.toDto(user), {
      accessTokenValidity: clientCredentials.accessTokenValidity,
      refreshTokenValidity: clientCredentials.refreshTokenValidity,
    });
  }

  public getUserFromToken(jwt: string, secret: string): User {
    return this.jwtService.verify<User>(jwt, {
      secret,
    });
  }

  private generateLoginObject(
    authenticatedUser: ClientCredentials | UserDTO,
    { accessTokenValidity, refreshTokenValidity }: GenerateLoginObjectOptions,
  ): GeneratedTokenDTO {
    let loginObject: GeneratedTokenDTO = {
      accessToken: this.jwtService.sign(classToPlain(authenticatedUser), {
        expiresIn: accessTokenValidity,
        secret: this.configService.jwtSecret,
      }),
      tokenType: 'bearer',
      expiresIn: accessTokenValidity,
    };
    if (refreshTokenValidity) {
      loginObject = {
        ...loginObject,
        refreshToken: this.jwtService.sign(classToPlain(authenticatedUser), {
          expiresIn: refreshTokenValidity,
          secret: this.configService.refreshTokenSecret,
        }),
      };
    }
    return loginObject;
  }

  private async findClientCredentialsByNameAndSecret(
    name: string,
    secret: string,
    grantType: GrantTypeEnum,
  ): Promise<ClientCredentials> {
    if (!name) {
      throw new InvalidClientCredentialsError();
    }
    const clientCredentials: ClientCredentials = await this.clientCredentialsRepository.findByNameAndSecret(
      name,
      secret,
    );
    if (
      !clientCredentials ||
      !clientCredentials.authorizedGrantTypes.includes(grantType)
    ) {
      throw new InvalidClientCredentialsError();
    }
    return clientCredentials;
  }
}
