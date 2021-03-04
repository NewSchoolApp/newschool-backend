import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../CommonsModule/constants';
import { Notification } from '../entity/notification.entity';
import { NotificationService } from '../service/notification.service';
import { OrderEnum } from '../../CommonsModule/enum/order.enum';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { NeedRole } from '../../CommonsModule/guard/role-metadata.guard';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';

@ApiBearerAuth()
@ApiTags('Notification')
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.NOTIFICATION_ENDPOINT}`,
)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get('/:id')
  @HttpCode(200)
  public async findNotificationById(
    @Param('id') id: string,
  ): Promise<Notification> {
    return this.service.findById(id);
  }

  @Put('/:id/see')
  @HttpCode(200)
  public async setSeeNotification(@Param('id') id: string): Promise<void> {
    return this.service.setSeeNotification(id);
  }

  @Get('/user/:userId')
  @HttpCode(200)
  public async getNotificationsByUserId(
    @Param('userId') userId: string,
    @Query('order') order: OrderEnum = OrderEnum.DESC,
    @Query('enabled') enabled = true,
    @Query('order') seen = false,
  ): Promise<Notification[]> {
    return this.service.getNotificationsByUserId(userId, order, enabled, seen);
  }

  @Post('/user/:userId')
  @NeedRole('@EDUCATION-PLATFORM/CREATE-NOTIFICATION')
  @UseGuards(RoleGuard)
  @HttpCode(200)
  public async addNotificationsToUser(
    @Param('userId') userId: string,
    @Body() notification: CreateNotificationDTO,
  ): Promise<Notification> {
    return this.service.addNotificationToUser(userId, notification);
  }
}
