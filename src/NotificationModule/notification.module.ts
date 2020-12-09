import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { PusherService } from './service/pusher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRepository])],
  controllers: [NotificationController],
  providers: [NotificationService, PusherService],
  exports: [NotificationService],
})
export class NotificationModule {}
