import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { IsBoolean, IsEnum, IsNotEmpty, IsObject } from 'class-validator';

export class CreateNotificationDTO {
  @IsBoolean()
  @IsNotEmpty()
  important = false;

  @IsEnum(NotificationTypeEnum)
  @IsNotEmpty()
  type: NotificationTypeEnum;

  @IsObject()
  content?: Record<string, string> = {};
}
