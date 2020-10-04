import { EntityRepository, Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification<unknown>> {}
