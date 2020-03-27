import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordRepository } from '../repository';
import { ChangePassword, User } from '../entity';
import { ConfigService } from '../../ConfigModule/service';

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
