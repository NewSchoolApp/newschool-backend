import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { UserModule } from '../UserModule/user.module';
import { CourseModule } from '../CourseModule/course.module';

@Module({
  imports: [UserModule, CourseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
