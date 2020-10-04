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

  public async getNotificationsByUser(
    user: User,
  ): Promise<Notification<unknown>[]> {
    return this.repository.find({ where: user });
  }

  public async getNotificationById(id: string): Promise<Notification<unknown>> {
    const notification = this.repository.findOne({ id });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
