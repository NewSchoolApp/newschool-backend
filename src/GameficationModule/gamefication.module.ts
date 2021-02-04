import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRewardsService } from './service/course-rewards.service';
import { PublisherService } from './service/publisher.service';
import { Badge } from './entity/badge.entity';
import { Achievement } from './entity/achievement.entity';
import { AchievementRepository } from './repository/achievement.repository';
import { BadgeRepository } from './repository/badge.repository';
import { NotificationModule } from '../NotificationModule/notification.module';
import { AchievementSubscriber } from './subscriber/achievement.subscriber';
import { UserModule } from '../UserModule/user.module';
import { CourseModule } from '../CourseModule/course.module';
import { GameficationController } from './controller/gamefication.controller';
import { GameficationService } from './service/gamefication.service';
import { UserRewardsService } from './service/user-rewards.service';
import { AchievementService } from './service/achievement.service';
import { CourseTakenRepository } from '../CourseModule/repository/course.taken.repository';
import { UserRepository } from '../UserModule/repository/user.repository';
import { UploadModule } from '../UploadModule/upload.module';

@Module({
  controllers: [GameficationController],
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementRepository,
      Badge,
      BadgeRepository,
      CourseTakenRepository,
      UserRepository,
    ]),
    HttpModule,
    forwardRef(() => UserModule),
    forwardRef(() => CourseModule),
    UploadModule,
    NotificationModule,
  ],
  providers: [
    CourseRewardsService,
    UserRewardsService,
    PublisherService,
    AchievementSubscriber,
    GameficationService,
    AchievementService,
  ],
  exports: [PublisherService, AchievementService],
})
export class GameficationModule {}
