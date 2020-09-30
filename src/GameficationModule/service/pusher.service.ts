import * as Pusher from 'pusher';
import { Injectable } from '@nestjs/common';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { ChannelEventEnum } from '../enum/channel-event.enum';

@Injectable()
export class PusherService {
  pusher: Pusher = null;

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher(this.configService.getPusherOptions());
  }

  public postMessageToUser(
    userId: string,
    event: ChannelEventEnum,
    message: unknown,
  ): void {
    this.pusher.trigger(userId, event, message);
  }
}
