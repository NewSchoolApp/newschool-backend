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
    return this.repository.save(user);
  }

  public async delete(id: User['id']): Promise<void> {
    await this.repository.delete(id);
  }

  public async update(id: User['id'], userUpdatedInfo: UserUpdateDTO): Promise<User> {
    const user: User = await this.findById(id);
    return this.repository.save({ ...user, ...userUpdatedInfo });
  }

  public async findByEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this.repository.findByEmailAndPassword(email, password);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}
