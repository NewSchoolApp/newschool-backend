import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidClientCredentialsError } from '../exception';
import { ClientCredentials } from '../entity';
import { ClientCredentialsEnum } from '../enum';
import { classToPlain } from 'class-transformer';
import { GeneratedTokenDTO, RefreshTokenUserDTO } from '../dto';
import { UserService } from '../../UserModule/service';
import { ClientCredentialsRepository, RoleRepository } from '../repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../UserModule/entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class SecurityService {
  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
  }

  @Transactional()
  public async validateClientCredentials(base64Login: string): Promise<GeneratedTokenDTO> {
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
    return Buffer.from(base64Login, 'base64')
      .toString('ascii');
  }

  @Transactional()
  public async validateUserCredentials(base64Login: string, username: string, password: string): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    const user: User = await this.userService.findByEmailAndPassword(username, password);
    return this.generateLoginObject(user);
  }

  @Transactional()
  public async refreshToken(base64Login: string, refreshToken: string): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    await this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    const { email, isRefreshToken }: RefreshTokenUserDTO = this.getUserFromToken(refreshToken);
    if (!isRefreshToken) {
      throw new UnauthorizedException('The given token is not a Refresh Token');
    }
    const user: User = await this.userService.findByEmail(email);
    return this.generateLoginObject(user);
  }

  public getUserFromToken<T extends User>(jwt: string): T {
    return this.jwtService.verify<T>(jwt);
  }

  private generateLoginObject(authenticatedUser: ClientCredentials | User): GeneratedTokenDTO {
    return {
      accessToken: this.jwtService.sign(classToPlain(authenticatedUser), { expiresIn: this.configService.get<string>('EXPIRES_IN_ACCESS_TOKEN') }),
      refreshToken: this.jwtService.sign(classToPlain({ ...authenticatedUser, isRefreshToken: true }), { expiresIn: this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN') }),
      tokenType: 'bearer',
      expiresIn: this.configService.get<string>('EXPIRES_IN_ACCESS_TOKEN'),
    };
  }

  private async findClientCredentialsByNameAndSecret(name: ClientCredentialsEnum, secret: string): Promise<ClientCredentials> {
    if (!name) {
      throw new InvalidClientCredentialsError();
    }
    const clientCredentials: ClientCredentials = await this.clientCredentialsRepository.findByNameAndSecret(name, secret);
    if (!clientCredentials) {
      throw new InvalidClientCredentialsError();
    }
    return clientCredentials;
  }
}
