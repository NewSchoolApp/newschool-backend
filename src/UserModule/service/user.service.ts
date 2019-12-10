import * as crypto from 'crypto';
import { ConflictException, GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository';
import { ChangePassword, User } from '../entity';
import { UserNotFoundError } from '../../SecurityModule/exception';
import { ForgotPasswordDTO, NewUserDTO, UserUpdateDTO } from '../dto';
import { ChangePasswordService } from './change-password.service';
import { MailerService } from '@nest-modules/mailer';
import { CONFIG } from '../../config/typeOrmConfiguration';

@Injectable()
export class UserService {

  constructor(
    private readonly repository: UserRepository,
    private readonly changePasswordService: ChangePasswordService,
    private readonly mailerService: MailerService,
  ) {
  }

  public async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async findById(id: User['id']): Promise<User> {
    const user: User | undefined = await this.repository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async add(user: NewUserDTO): Promise<User> {
    const userWithSameEmail: User = await this.repository.findByEmail(user.email);
    if (userWithSameEmail) {
      throw new ConflictException();
    }
    const salt: string = this.createSalt();
    const hashPassword: string = this.createHashedPassword(user.password, salt);
    return this.repository.save({
      ...user,
      salt,
      password: hashPassword,
    });
  }

  public async delete(id: User['id']): Promise<void> {
    await this.repository.delete(id);
  }

  public async update(id: User['id'], userUpdatedInfo: UserUpdateDTO): Promise<User> {
    const user: User = await this.findById(id);
    return this.repository.save({ ...user, ...userUpdatedInfo });
  }

  public async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<string> {
    const user: User = await this.findByEmail(forgotPasswordDTO.email);
    const changePassword: ChangePassword = await this.changePasswordService.createChangePasswordRequest(user);
    await this.sendChangePasswordEmail(user);
    return changePassword.id;
  }

  public async findByEmail(email: string): Promise<User> {
    const user: User = await this.repository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  public async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user: User = await this.findByEmail(email);
    if (!user.validPassword(password)) {
      throw new UserNotFoundError();
    }
    return user;
  }

  public async validateChangePassword(changePasswordRequestId: string) {
    const changePassword: ChangePassword = await this.changePasswordService.findById(changePasswordRequestId);
    if (Date.now() > new Date(changePassword.createdAt).getTime() + changePassword.expirationTime) {
      throw new GoneException();
    }
  }

  private createSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createHashedPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  private async sendChangePasswordEmail(user: User): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: CONFIG.EMAIL_FROM,
        subject: CONFIG.CHANGE_PASSWORD_SUBJECT,
        template: 'change-password',
        context: {
          name: user.name,
          urlTrocaSenha: `${CONFIG.FRONT_URL}/${CONFIG.CHANGE_PASSWORD_URL}`,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
