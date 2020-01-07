import { Module } from '@nestjs/common';
import { UploadController } from './controllers';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {
}
