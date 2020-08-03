import { Module } from '@nestjs/common';
import { DashboardController } from './controller';
import { DashboardService } from './service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [],
})
export class DashboardModule {}
