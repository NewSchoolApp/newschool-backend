import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Achievement } from '../entity/achievement.entity';
import { NotificationService } from '../../NotificationModule/service/notification.service';
import { PusherService } from '../service/pusher.service';
import { NotificationTypeEnum } from '../../NotificationModule/enum/notification-type.enum';
import { ChannelEventEnum } from '../enum/channel-event.enum';
import { InjectConnection } from '@nestjs/typeorm';

@EventSubscriber()
export class AchievementSubscriber
  implements EntitySubscriberInterface<Achievement> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly notificationService: NotificationService,
    private readonly pusherService: PusherService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Achievement;
  }

  async afterInsert(event: InsertEvent<Achievement>): Promise<void> {
    if (!event.entity.completed) return;
    await this.notificationService.create<Achievement>(
      event.entity.user,
      NotificationTypeEnum.GAMEFICATION,
      event.entity,
    );
    this.pusherService.postMessageToUser(
      event.entity.user.id,
      ChannelEventEnum.GAMEFICATION,
      event.entity,
    );
  }

  async afterUpdate(event: UpdateEvent<Achievement>): Promise<void> {
    if (!event.entity.completed) return;
    await this.notificationService.create<Achievement>(
      event.entity.user,
      NotificationTypeEnum.GAMEFICATION,
      event.entity,
    );
    this.pusherService.postMessageToUser(
      event.entity.user.id,
      ChannelEventEnum.GAMEFICATION,
      event.entity,
    );
  }
}
