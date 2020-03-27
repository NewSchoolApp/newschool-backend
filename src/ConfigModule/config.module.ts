import { Global, Module } from '@nestjs/common';
import { ConfigService } from './service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
