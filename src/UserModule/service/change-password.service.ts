import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordRepository } from '../repository/change-password.repository';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { ChangePassword } from '../entity/change-password.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly repository: ChangePasswordRepository,
    private readonly configService: ConfigService,
  ) {}

  public async createChangePasswordRequest(
    user: User,
  ): Promise<ChangePassword> {
    const changePassword: ChangePassword = new ChangePassword();
    changePassword.user = user;
    changePassword.expirationTime = this.configService.changePasswordExpirationTime;
    return this.repository.save(changePassword);
  }

  public async findById(id: string): Promise<ChangePassword> {
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
