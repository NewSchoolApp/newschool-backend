import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CourseModule } from './CourseModule';
import { CourseTakenModule } from './CourseTakenModule';
import { CertificateModule } from './CertificateModule';
import { MessageModule } from './MessageModule';
import { UploadModule } from './UploadModule';
import { ConfigModule, ConfigService } from './ConfigModule';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';

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
    CourseTakenModule,
    CertificateModule,
    MessageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
