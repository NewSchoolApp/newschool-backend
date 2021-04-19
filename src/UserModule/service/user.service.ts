import * as crypto from 'crypto';
import * as path from 'path';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  HttpService,
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
import { AchievementService } from '../../GameficationModule/service/achievement.service';
import { BadgeWithQuantityDTO } from '../../GameficationModule/dto/badge-with-quantity.dto';
import { PublisherService } from '../../GameficationModule/service/publisher.service';
import { UploadService } from '../../UploadModule/service/upload.service';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { SemearService } from './semear.service';
import SecurePassword = require('secure-password');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const securePassword = require('secure-password');

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly http: HttpService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly achievementService: AchievementService,
    private readonly uploadService: UploadService,
    private readonly semearService: SemearService,
    private readonly publisherService: PublisherService,
  ) {}

  @Transactional()
  public async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findById(id: string): Promise<User> {
    const response: User[] = await this.repository.find({
      where: { id },
      relations: ['role'],
    });
    const user = response[0];
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Transactional()
  public async getCertificateByUser(
    userId: string,
  ): Promise<CertificateUserDTO[]> {
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

  public async countUsersInvitedByUserId(id: string): Promise<number> {
    return this.repository.countUsersInvitedByUserId(id);
  }

  public async hashUserPassword(user: User, password: string): Promise<User> {
    const pwd: SecurePassword = securePassword();
    const hashBuffer = await pwd.hash(Buffer.from(password));
    return this.repository.save({
      ...user,
      password: hashBuffer.toString(),
    });
  }

  public async addStudent(user: NewUserDTO, inviteKey: string): Promise<User> {
    let invitedByUserId: string | null;
    if (inviteKey) {
      const invitedByUser: User = await this.repository.findByInviteKey(
        inviteKey,
      );
      invitedByUserId = invitedByUser ? invitedByUser.id : null;
    }

    const newStudent = await this.add({ ...user, invitedByUserId });

    if (inviteKey) {
      // iniciar gameficação
      this.publisherService.emitInviteUserReward(inviteKey);
    }
    return newStudent;
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
        inviteKey: `${this.generateInviteKey()}${this.generateInviteKey()}`,
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

  public async update(
    id: User['id'],
    userUpdatedInfo: UserUpdateDTO,
  ): Promise<User> {
    const user: User = await this.findById(id);
    let role = user.role;
    if (userUpdatedInfo.role) {
      role = await this.roleService.findByRoleName(userUpdatedInfo.role);
    }
    const updatedUser = await this.repository.save({
      ...user,
      ...userUpdatedInfo,
      role,
    });
    if (updatedUser.role.name === RoleEnum.STUDENT) {
      this.publisherService.emitupdateStudent(id);
    }
    this.semearService.sendSemearNotification(updatedUser);
    return updatedUser;
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
  public async validateChangePassword(
    changePasswordRequestId: string,
  ): Promise<void> {
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
    if (changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword)
      throw new BadRequestException('New passwords are not the same');
    const user: User = await this.findById(id);
    const oldPassword = this.createHashedPassword(
      changePasswordDTO.oldPassword,
      user.salt,
    );
    if (oldPassword !== user.password)
      throw new BadRequestException(
        'Old password does not match with current password',
      );
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

  async uploadUserPhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<void> {
    const acceptedFileExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname);

    if (!acceptedFileExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Accepted file types are ${acceptedFileExtensions.join(
          ',',
        )}, you upload a ${fileExtension} file`,
      );
    }

    const user: User = await this.findById(userId);

    const photoPath = `${user.id}/avatar.jpg`;

    await this.uploadService.uploadUserPhoto(photoPath, file.buffer);
    await this.repository.save({ ...user, photoPath });
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

  async findBadgesWithQuantityByUserId(
    id: string,
  ): Promise<BadgeWithQuantityDTO[]> {
    const user = await this.findById(id);
    return this.achievementService.findBadgesWithQuantityByUser(user);
  }

  async getUserPhoto(id: string): Promise<string> {
    const user = await this.findById(id);
    return this.uploadService.getUserPhoto(user.photoPath);
  }

  public async acceptSemear(id: string): Promise<void> {
    const filePath = `semear/${id}.json`;
    const user: User = await this.findById(id);
    const fileExists = await this.uploadService.fileExists(filePath);
    if (fileExists) return;
    await this.uploadService.uploadDataToS3(filePath, user);
  }

  public async userAcceptedSemear(id: string): Promise<boolean> {
    const filePath = `semear/${id}.json`;
    return await this.uploadService.fileExists(filePath);
  }

  private generateInviteKey(): string {
    return Math.random().toString(36).substr(2, 20);
  }

  public async getStudentsAcceptedSemearTerms() {
    const data = await this.uploadService.getFilesInsideFolder('semear');
    let students = [];
    for (const content of data.Contents) {
      const filedata = await this.uploadService.getFile(content.Key);
      const json = JSON.parse(filedata.Body.toString('utf-8'));
      students = [...students, json];
    }
    return students;
  }
}
