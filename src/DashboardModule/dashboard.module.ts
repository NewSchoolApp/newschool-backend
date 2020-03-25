import { Module } from '@nestjs/common';
import { DashboardController } from './controller';
import { DashboardService } from './service';
import { UserModule } from 'src/UserModule';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [UserModule],
})
export class DashboardModule {}
