import { Injectable } from '@nestjs/common';
import { InvalidClientCredentialsError } from '../exception';
import { ClientCredentials, Role } from '../entity';
import { ClientCredentialsEnum, RoleEnum } from '../enum';
import { classToPlain } from 'class-transformer';
import { GeneratedTokenDTO } from '../dto';
import { UserService } from '../../UserModule/service';
import { ClientCredentialsRepository, RoleRepository } from '../repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../UserModule/entity';
import { NewUserDTO } from '../../UserModule/dto';

@Injectable()
export class SecurityService {

  constructor(
    private readonly clientCredentialsRepository: ClientCredentialsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    // this.saveDefault();
  }

  private async saveDefault() {
    const roleAdmin = new Role();
    roleAdmin.name = RoleEnum.ADMIN;
    const savedRoleAdmin = await this.roleRepository.save(roleAdmin);
    const roleStudent = new Role();
    roleStudent.name = RoleEnum.STUDENT;
    const savedRoleStudent = await this.roleRepository.save(roleStudent);
    const roleExternal = new Role();
    roleExternal.name = RoleEnum.EXTERNAL;
    const savedRoleExternal = await this.roleRepository.save(roleExternal);
    const clientCredentialsFront = new ClientCredentials();
    clientCredentialsFront.name = ClientCredentialsEnum['NEWSCHOOL@FRONT'];
    clientCredentialsFront.secret = 'NEWSCHOOL@FRONTSECRET';
    await this.clientCredentialsRepository.save(clientCredentialsFront);
    const clientCredentialsFrontChangePassword = new ClientCredentials();
    clientCredentialsFrontChangePassword.name = ClientCredentialsEnum.FRONT_CHANGE_PASSWORD;
    clientCredentialsFrontChangePassword.secret = 'NEWSCHOOL@FRONTSECRET';
    clientCredentialsFrontChangePassword.role = savedRoleExternal;
    await this.clientCredentialsRepository.save(clientCredentialsFrontChangePassword);
    const studentUser: User = new User();
    studentUser.name = 'aluno';
    studentUser.email = 'aluno@teste.com';
    studentUser.password = 'randomPass';
    studentUser.urlFacebook = 'facebook';
    studentUser.urlInstagram = 'instagram';
    studentUser.role = savedRoleStudent;
    await this.userService.add(studentUser as unknown as NewUserDTO);
    const adminUser: User = new User();
    adminUser.name = 'admin';
    adminUser.email = 'admin@teste.com';
    adminUser.password = 'randomPass';
    adminUser.urlFacebook = 'facebook';
    adminUser.urlInstagram = 'instagram';
    adminUser.role = savedRoleAdmin;
    await this.userService.add(adminUser as unknown as NewUserDTO);
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
