import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { Notification } from '../entity/notification.entity';
import { User } from '../../UserModule/entity/user.entity';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  public async create<
    T = { new () } | Record<string | number | symbol, unknown>
  >(
    user: User,
    type: NotificationTypeEnum,
    content: T,
    options = { important: false },
  ): Promise<Notification<T>> {
    return this.repository.save({ user, type, content, ...options });
  }

  public async getNotificationsByUser(user: User): Promise<Notification[]> {
    return this.repository.find({ where: user });
  }

  public async getNotificationsByUserId(
    userId: string,
    order: OrderEnum,
    enabled: boolean,
    seen: boolean,
  ): Promise<Notification[]> {
    return this.repository.getNotificationsByUserId(
      userId,
      order,
      enabled,
      seen,
    );
  }

  public async setSeeNotification(id: string): Promise<void> {
    const notification = await this.findById(id);
    await this.repository.save({ ...notification, enabled: false, seen: true });
  }

  public async findById(id: string): Promise<Notification> {
    const response: Notification[] = await this.repository.find({ id });
    if (!response.length) {
      throw new NotFoundException('Notification not found');
    }
    return response[0];
  }
}
