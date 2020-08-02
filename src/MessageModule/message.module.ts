import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule/security.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from './repository/template.repository';
import { TemplateMapper } from './mapper/template.mapper';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    SecurityModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, TemplateMapper],
  exports: [MessageService],
})
export class MessageModule {}
