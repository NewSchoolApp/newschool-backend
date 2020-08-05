import { Global, Module } from '@nestjs/common';
import { AppConfigService as ConfigService } from './service/app-config.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
