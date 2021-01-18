import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { PusherService } from '../service/pusher.service';

@EventSubscriber()
export class NotificationSubscriber
  implements EntitySubscriberInterface<Notification> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly pusherService: PusherService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Notification {
    return Notification;
  }

  async afterInsert(event: InsertEvent<Notification>): Promise<void> {
    this.pusherService.postMessageToUser(event.entity);
  }

  async afterUpdate(event: UpdateEvent<Notification>): Promise<void> {
    this.pusherService.postMessageToUser(event.entity);
  }
}
