import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordRepository } from '../repository';
import { ChangePassword, User } from '../entity';
import { AppConfigService } from '../../AppConfigModule/service';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly repository: ChangePasswordRepository,
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  public async createChangePasswordRequest(
    user: User,
  ): Promise<ChangePassword> {
    const changePassword: ChangePassword = new ChangePassword();
    changePassword.user = user;
    changePassword.expirationTime = this.appConfigService.changePasswordExpirationTime;
    return this.repository.save(changePassword);
  }

  public async findById(id: string) {
    const changePassword: ChangePassword = await this.repository.findOne(
      { id },
      { relations: ['user'] },
    );
    if (!changePassword) {
      throw new NotFoundException();
    }
    return changePassword;
  }
}
