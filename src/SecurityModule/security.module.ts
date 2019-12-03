import { Module } from '@nestjs/common';
import { SecurityController } from './controller';
import { SecurityService } from './service';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {
}
