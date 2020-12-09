import * as Pusher from 'pusher';
import { Injectable } from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { Notification } from '../entity/notification.entity';

@Injectable()
export class PusherService {
  private pusher: Pusher = null;

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher(this.configService.getPusherOptions());
  }

  public postMessageToUser(notification: Notification): void {
    this.pusher.trigger(notification.user.id, notification.type, notification);
  }
}
