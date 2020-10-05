import { MailerModule } from '@nest-modules/mailer';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SecurityModule } from './SecurityModule/security.module';
import { UserModule } from './UserModule/user.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CourseModule } from './CourseModule/course.module';
import { MessageModule } from './MessageModule/message.module';
import { UploadModule } from './UploadModule/upload.module';
import { ConfigModule } from './ConfigModule/config.module';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';
import { DashboardModule } from './DashboardModule/dashboard.module';
import { GameficationModule } from './GameficationModule/gamefication.module';
import { NotificationModule } from './NotificationModule/notification.module';

const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getDatabaseConfig(),
};

const mailerAsyncModule: MailerAsyncOptions = {
  useFactory: (appConfigService: ConfigService) =>
    appConfigService.getSmtpConfiguration(),
  imports: [ConfigModule],
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule,
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncModule),
    MailerModule.forRootAsync(mailerAsyncModule),
    SecurityModule,
    UserModule,
    CourseModule,
    MessageModule,
    UploadModule,
    DashboardModule,
    GameficationModule,
    NotificationModule,
  ],
})
export class AppModule {}
