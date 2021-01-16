import { Injectable, OnModuleInit } from '@nestjs/common';
import * as PubSub from 'pubsub-js';
import { EventNameEnum } from '../../GameficationModule/enum/event-name.enum';
import { User } from '../entity/user.entity';
import { EscolarityEnum } from '../enum/escolarity.enum';
import { NotificationService } from '../../NotificationModule/service/notification.service';
import { NotificationTypeEnum } from '../../NotificationModule/enum/notification-type.enum';
import { UploadService } from '../../UploadModule/service/upload.service';

@Injectable()
export class SemearService implements OnModuleInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly uploadService: UploadService,
  ) {}

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

    const userHasSemearFile = await this.uploadService.fileExists(
      `/semear/${user.id}`,
    );
    if (userHasSemearFile) return;

    const notification = await this.notificationService.getSemearNotSeenAndEanbledNotificationByUserId(
      user.id,
    );
    if (notification) return;

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
