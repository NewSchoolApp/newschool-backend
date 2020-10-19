import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  GoneException,
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CertificateUserDTO } from '../dto/certificate-user.dto';

import { ChangePasswordService } from './change-password.service';
import { MailerService } from '@nest-modules/mailer';
import { RoleService } from '../../SecurityModule/service/role.service';
import { Role } from '../../SecurityModule/entity/role.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { ChangePassword } from '../entity/change-password.entity';
import { AdminChangePasswordDTO } from '../dto/admin-change-password.dto';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { ForgotPasswordDTO } from '../dto/forgot-password';
import { ChangePasswordForgotFlowDTO } from '../dto/change-password-forgot-flow.dto';
import { UserNotFoundError } from '../../SecurityModule/exception/user-not-found.error';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { ChangePasswordDTO } from '../dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly http: HttpService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  @Transactional()
  public async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findById(id: User['id']): Promise<User> {
    const user: User | undefined = await this.repository.findOne(id, {
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Transactional()
  public async getCertificateByUser(userId): Promise<CertificateUserDTO[]> {
    const certificates = await this.repository.getCertificateByUser(userId);

    return certificates.map<CertificateUserDTO>((certificate) => {
      const c = new CertificateUserDTO();
      c.id = certificate.certificate_id;
      c.title = certificate.certificate_title;
      c.userName = certificate.user_name;
      c.text = certificate.certificate_text;
      c.certificateBackgroundName =
        certificate.certificate_certificateBackgroundName;
      return c;
    });
  }

  public async getUsersQuantity(): Promise<number> {
    return this.repository.getUsersQuantity();
  }

  public async add(user: NewUserDTO): Promise<User> {
    const role: Role = await this.roleService.findByRoleName(user.role);
    const salt: string = this.createSalt();
    const hashPassword: string = this.createHashedPassword(user.password, salt);
    try {
      return await this.repository.save({
        ...user,
        salt,
        password: hashPassword,
        role,
      });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with same email already exists');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Transactional()
  public async delete(id: User['id']): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }

  @Transactional()
  public async update(
    id: User['id'],
    userUpdatedInfo: UserUpdateDTO,
  ): Promise<User> {
    const user: User = await this.findById(id);
    if (userUpdatedInfo.role) {
      const role = await this.roleService.findByRoleName(userUpdatedInfo.role);
      return this.repository.save({
        ...user,
        ...userUpdatedInfo,
        role,
        id: user.id,
      });
    }
    return await this.repository.save({
      ...user,
      ...userUpdatedInfo,
      role: user.role,
      id: user.id,
    });
  }

  public async forgotPassword(
    forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<string> {
    const user: User = await this.findByEmail(forgotPasswordDTO.email);
    const changePassword: ChangePassword = await this.changePasswordService.createChangePasswordRequest(
      user,
    );
    await this.sendChangePasswordEmail(user, changePassword.id);
    return changePassword.id;
  }

  @Transactional()
  public async findByEmail(email: string): Promise<User> {
    const user: User = await this.repository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  @Transactional()
  public async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user: User = await this.findByEmail(email);
    if (!user.validPassword(password)) {
      throw new UserNotFoundError();
    }
    return user;
  }

  @Transactional()
  public async findByEmailAndFacebookId(
    email: string,
    facebookId: string,
  ): Promise<User> {
    const user: User = await this.repository.findByEmailAndFacebookId(
      email,
      facebookId,
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  @Transactional()
  public async validateChangePassword(changePasswordRequestId: string) {
    const changePassword: ChangePassword = await this.changePasswordService.findById(
      changePasswordRequestId,
    );
    if (
      Date.now() >
      new Date(changePassword.createdAt).getTime() +
        changePassword.expirationTime
    ) {
      throw new GoneException();
    }
  }

  @Transactional()
  public async adminChangePassword(
    id: string,
    changePasswordDTO: AdminChangePasswordDTO,
  ): Promise<User> {
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new BadRequestException('New passwords does not match');
    }
    const user: User = await this.findById(id);
    user.salt = this.createSalt();
    user.password = this.createHashedPassword(
      changePasswordDTO.newPassword,
      user.salt,
    );
    return await this.repository.save(user);
  }

  @Transactional()
  public async changePassword(
    id: string,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<User> {
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new BadRequestException('New passwords does not match');
    }
    const user: User = await this.findById(id);
    if (!user.validPassword(changePasswordDTO.password)) {
      throw new BadRequestException(
        'Old password does not match with given password',
      );
    }
    user.salt = this.createSalt();
    user.password = this.createHashedPassword(
      changePasswordDTO.newPassword,
      user.salt,
    );
    return await this.repository.save(user);
  }

  @Transactional()
  public async changePasswordForgotPasswordFlow(
    changePasswordRequestId: string,
    changePasswordDTO: ChangePasswordForgotFlowDTO,
  ): Promise<User> {
    if (
      changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword
    ) {
      throw new BadRequestException('passwords does not match');
    }
    const { user }: ChangePassword = await this.changePasswordService.findById(
      changePasswordRequestId,
    );
    user.salt = this.createSalt();
    user.password = this.createHashedPassword(
      changePasswordDTO.newPassword,
      user.salt,
    );
    return await this.repository.save(user);
  }

  private createSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createHashedPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
  }

  private async sendChangePasswordEmail(
    user: User,
    changePasswordRequestId: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.smtpFrom,
        subject: 'Troca de senha',
        template: 'change-password',
        context: {
          name: user.name,
          urlTrocaSenha: this.configService.getChangePasswordFrontUrl(
            changePasswordRequestId,
          ),
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
