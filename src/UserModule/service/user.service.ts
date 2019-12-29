import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException, forwardRef,
  GoneException, Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository';
import { ChangePassword, User } from '../entity';
import { UserNotFoundError } from '../../SecurityModule/exception';
import { ForgotPasswordDTO, NewUserDTO, UserUpdateDTO } from '../dto';
import { ChangePasswordService } from './change-password.service';
import { MailerService } from '@nest-modules/mailer';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { Certificate } from '../../CertificateModule/entity';
import { CertificateService } from '../../CertificateModule/service';
import { RoleService } from '../../SecurityModule/service';
import { Role } from '../../SecurityModule/entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly changePasswordService: ChangePasswordService,
    private readonly mailerService: MailerService,
    private readonly certificateService: CertificateService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {
  }

  @Transactional()
  public async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  @Transactional()
  public async findById(id: User['id']): Promise<User> {
    const user: User | undefined = await this.repository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async add(user: NewUserDTO): Promise<User> {
    const userWithSameEmail: User = await this.repository.findByEmail(user.email);
    if (userWithSameEmail) {
      throw new ConflictException();
    }
    const role: Role = await this.roleService.findByRoleName(user.role);
    const salt: string = this.createSalt();
    const hashPassword: string = this.createHashedPassword(user.password, salt);
    return this.repository.save({
      ...user,
      salt,
      password: hashPassword,
      role,
    });
  }

  @Transactional()
  public async delete(id: User['id']): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }

  @Transactional()
  public async update(id: User['id'], userUpdatedInfo: UserUpdateDTO): Promise<User> {
    const user: User = await this.findById(id);
    const role: Role = await this.roleService.findByRoleName(userUpdatedInfo.role);
    return this.repository.save({ ...user, ...userUpdatedInfo, role });
  }

  public async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<string> {
    const user: User = await this.findByEmail(forgotPasswordDTO.email);
    const changePassword: ChangePassword = await this.changePasswordService.createChangePasswordRequest(user);
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
  public async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user: User = await this.findByEmail(email);
    if (!user.validPassword(password)) {
      throw new UserNotFoundError();
    }
    return user;
  }

  @Transactional()
  public async validateChangePassword(changePasswordRequestId: string) {
    const changePassword: ChangePassword = await this.changePasswordService.findById(changePasswordRequestId);
    if (Date.now() > new Date(changePassword.createdAt).getTime() + changePassword.expirationTime) {
      throw new GoneException();
    }
  }

  @Transactional()
  public async changePassword(changePasswordRequestId: string, changePasswordDTO: ChangePasswordDTO) {
    if (changePasswordDTO.password !== changePasswordDTO.validatePassword) {
      throw new BadRequestException();
    }
    const { user }: ChangePassword = await this.changePasswordService.findById(changePasswordRequestId);
    user.salt = this.createSalt();
    user.password = this.createHashedPassword(changePasswordDTO.newPassword, user.salt);
    await this.repository.save(user);
  }

  @Transactional()
  public async addCertificateToUser(userId: User['id'], certificateId: Certificate['id']) {
    const [user, certificate]: [User, Certificate] = await Promise.all([
      this.repository.findByIdWithCertificates(userId),
      this.certificateService.findById(certificateId),
    ]);
    return await this.repository.save({ ...user, certificates: [...user.certificates, certificate] });
  }

  private createSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createHashedPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  private async sendChangePasswordEmail(user: User, changePasswordRequestId: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'NewSchool@email.com',
        subject: 'Troca de senha',
        template: 'change-password',
        context: {
          name: user.name,
          urlTrocaSenha: `${this.configService.get<string>('FRONT_URL')}/${this.configService.get<string>('CHANGE_PASSWORD_URL')}?changePasswordRequestId=${changePasswordRequestId}`,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
