import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from './repository/template.repository';
import { TemplateMapper } from './mapper/template.mapper';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateRepository])],
  controllers: [MessageController],
  providers: [MessageService, TemplateMapper],
  exports: [MessageService],
})
export class MessageModule {}
