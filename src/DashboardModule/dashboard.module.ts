import { Module } from '@nestjs/common';
import { DashboardService } from './service';
import { DashboardController } from './controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
