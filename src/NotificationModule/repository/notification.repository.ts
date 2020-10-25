import { EntityRepository, Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  public async getNotificationsByUserId(
    userId: string,
  ): Promise<Notification[]> {
    return this.find({ where: { user: { id: userId } } });
  }
}
