import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository';
import { User } from '../entity';
import { UserNotFoundError } from '../../SecurityModule/exception';
import { NewUserDTO, UserUpdateDTO } from '../dto';

@Injectable()
export class UserService {

  constructor(
    private readonly repository: UserRepository,
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

  public add(user: NewUserDTO): Promise<User> {
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

  public async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user: User = await this.repository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!user.validPassword(password)) {
      throw new UserNotFoundError();
    }
    return user;
  }

  private createSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private createHashedPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }
}
