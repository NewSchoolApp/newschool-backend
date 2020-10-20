import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '../SecurityModule/security.module';
import { CourseRewardsService } from './service/course-rewards.service';
import { PublisherService } from './service/publisher.service';
import { Badge } from './entity/badge.entity';
import { Achievement } from './entity/achievement.entity';
import { AchievementRepository } from './repository/achievement.repository';
import { BadgeRepository } from './repository/badge.repository';
import { PusherService } from './service/pusher.service';
import { NotificationModule } from '../NotificationModule/notification.module';
import { AchievementSubscriber } from './subscriber/achievement.subscriber';
import { UserModule } from '../UserModule/user.module';
import { CourseModule } from '../CourseModule/course.module';
import { GameficationController } from './controller/gamefication.controller';
import { GameficationService } from './service/gamefication.service';
import { UserRewardsService } from './service/user-rewards.service';
import { AchievementService } from './service/achievement.service';

@Module({
  controllers: [GameficationController],
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementRepository,
      Badge,
      BadgeRepository,
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => SecurityModule),
    forwardRef(() => UserModule),
    forwardRef(() => CourseModule),
    NotificationModule,
  ],
  providers: [
    CourseRewardsService,
    UserRewardsService,
    PublisherService,
    PusherService,
    AchievementSubscriber,
    GameficationService,
    AchievementService,
  ],
  exports: [PublisherService, AchievementService],
})
export class GameficationModule {}
