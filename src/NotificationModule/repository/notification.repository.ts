import { EntityRepository, Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { NotificationTypeEnum } from '../enum/notification-type.enum';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  public async getNotificationsByUserId(
    userId: string,
    order: OrderEnum,
    enabled: boolean,
    seen: boolean,
  ): Promise<Notification[]> {
    return this.find({
      where: { user: { id: userId }, enabled, seen },
      order: { createdAt: order },
    });
  }

  public async getOtherNotificationsByUserId(
    userId: string,
  ): Promise<Notification[]> {
    return this.find({
      where: {
        user: { id: userId },
        enabled: true,
        seen: false,
        type: NotificationTypeEnum.OTHER,
      },
    });
  }
}
