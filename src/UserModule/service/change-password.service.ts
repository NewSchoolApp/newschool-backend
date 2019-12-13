import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangePasswordRepository } from '../repository';
import { ChangePassword, User } from '../entity';

@Injectable()
export class ChangePasswordService {

  constructor(
    private readonly repository: ChangePasswordRepository,
  ) {
  }

  public async createChangePasswordRequest(user: User): Promise<ChangePassword> {
    const changePassword: ChangePassword = new ChangePassword();
    changePassword.user = user;
    changePassword.expirationTime = Number(process.env.CHANGE_PASSWORD_EXPIRATION_TIME);
    return this.repository.save(changePassword);
  }

  public async findById(id: string) {
    const changePassword: ChangePassword = await this.repository.findOne({ id }, { relations: [ 'user' ] });
    if (!changePassword) {
      throw new NotFoundException();
    }
    return changePassword
  }
}
