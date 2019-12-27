import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { ChangePasswordRepository } from '../repository';
import { ChangePassword, User } from '../entity';

@Injectable()
export class ChangePasswordService {

  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {
  }

  public async createChangePasswordRequest(user: User): Promise<ChangePassword> {
    const changePassword: ChangePassword = new ChangePassword();
    changePassword.user = user;
    changePassword.expirationTime = this.configService.get<number>('CHANGE_PASSWORD_EXPIRATION_TIME');
    return this.entityManager.getCustomRepository(ChangePasswordRepository).save(changePassword);
  }

  public async findById(id: string) {
    const changePassword: ChangePassword = await this.entityManager
      .getCustomRepository(ChangePasswordRepository)
      .findOne({ id }, { relations: ['user'] });
    if (!changePassword) {
      throw new NotFoundException();
    }
    return changePassword;
  }
}
