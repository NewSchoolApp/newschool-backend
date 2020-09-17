import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule/security.module';
import { CourseRewardsService } from './service/course-rewards.service';
import { PublisherService } from './service/publisher.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    SecurityModule,
  ],
  providers: [CourseRewardsService, PublisherService],
  exports: [PublisherService],
})
export class GameficationModule {}
