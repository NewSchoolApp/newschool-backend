import { Controller, Get, Param } from '@nestjs/common';
import { Constants } from '../../CommonsModule/constants';
import { Notification } from '../entity/notification.entity';

@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.NOTIFICATION_ENDPOINT}`,
)
export class NotificationController {
  @Get('/user/:userId')
  public async getNotificationsByUserId(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return null;
  }
}
