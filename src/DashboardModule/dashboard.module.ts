import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { UserModule } from '../UserModule/user.module';
import { CourseTakenModule } from '../CourseTakenModule/course.taken.module';

@Module({
  imports: [UserModule, CourseTakenModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
