import { Injectable } from '@nestjs/common';
import { InvalidClientCredentialsError } from '../exception';
import { ClientCredentials } from '../entity';
import { ClientCredentialsEnum } from '../enum';
import { classToPlain } from 'class-transformer';
import { GeneratedTokenDTO } from '../dto';
import { UserService } from '../../UserModule/service';
import { ClientCredentialsRepository, RoleRepository } from '../repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../UserModule/entity';

@Injectable()
export class SecurityService {

  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
  }

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

  public async validateUserCredentials(base64Login: string, username: string, password: string): Promise<GeneratedTokenDTO> {
    const [name, secret]: string[] = this.splitClientCredentials(
      this.base64ToString(base64Login),
    );
    this.findClientCredentialsByNameAndSecret(
      ClientCredentialsEnum[name],
      secret,
    );
    const user: User = await this.userService.findByEmailAndPassword(username, password);
    return this.generateLoginObject(user);
  }

  private generateLoginObject(authenticatedUser: ClientCredentials | User): GeneratedTokenDTO {
    return {
      accessToken: this.jwtService.sign(classToPlain(authenticatedUser), { expiresIn: Number(process.env.EXPIRES_IN_ACCESS_TOKEN) }),
      refreshToken: this.jwtService.sign(classToPlain(authenticatedUser), { expiresIn: Number(process.env.EXPIRES_IN_REFRESH_TOKEN) }),
      tokenType: 'bearer',
      expiresIn: Number(process.env.EXPIRES_IN_ACCESS_TOKEN),
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
