import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationService } from './service/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationRepository])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
