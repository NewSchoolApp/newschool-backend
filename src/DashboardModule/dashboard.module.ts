import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { UserModule } from '../UserModule/user.module';

@Module({
  imports: [UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
