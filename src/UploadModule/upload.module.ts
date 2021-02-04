import { HttpModule, Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
  imports: [HttpModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
