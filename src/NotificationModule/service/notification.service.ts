import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { Notification } from '../entity/notification.entity';
import { User } from '../../UserModule/entity/user.entity';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  public async create<T>(
    user: User,
    type: NotificationTypeEnum,
    content: T,
  ): Promise<Notification<T>> {
    return this.repository.save({ user, type, content });
  }

  public async getNotificationsByUser(user: User): Promise<Notification[]> {
    return this.repository.find({ where: user });
  }

  public async getNotificationsByUserId(
    userId: string,
  ): Promise<Notification[]> {
    return this.repository.getNotificationsByUserId(userId);
  }

  public async findNotificationById(id: string): Promise<Notification> {
    const response: Notification[] = await this.repository.find({ id });
    if (!response.length) {
      throw new NotFoundException('Notification not found');
    }
    return response[0];
  }
}
