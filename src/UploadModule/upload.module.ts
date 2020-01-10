import { Module } from '@nestjs/common';
import { UploadController } from './controllers';
import { UploadService } from './service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {
}
