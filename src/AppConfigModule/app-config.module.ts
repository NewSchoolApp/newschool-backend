import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
