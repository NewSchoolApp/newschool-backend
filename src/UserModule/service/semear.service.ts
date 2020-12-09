import { Injectable, OnModuleInit } from '@nestjs/common';
import * as PubSub from 'pubsub-js';
import { EventNameEnum } from '../../GameficationModule/enum/event-name.enum';
import { User } from '../entity/user.entity';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { NotificationService } from '../../NotificationModule/service/notification.service';
import { NotificationTypeEnum } from '../../NotificationModule/enum/notification-type.enum';

@Injectable()
export class SemearService implements OnModuleInit {
  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit(): void {
    PubSub.subscribe(
      EventNameEnum.COURSE_REWARD_COMPLETE_COURSE,
      async (message: string, data: User) => {
        await this.sendSemearNotification(data);
      },
    );
  }

  public async sendSemearNotification(user: User): Promise<void> {
    if (
      user.schooling !== EscolarityEnum.ENSINO_MEDIO_COMPLETO &&
      user.schooling !== EscolarityEnum.TERCEIRO_ANO
    )
      return;

    await this.notificationService.create<Record<string, string>>(
      user,
      NotificationTypeEnum.OTHER,
      {
        semearSiteUrl: 'http://www.isemear.org.br/processo-seletivo/',
      },
      { important: true },
    );
  }
}
