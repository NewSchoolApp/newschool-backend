import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AppConfigModule, AppConfigService } from './AppConfigModule';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';

// const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
//   imports: [AppConfigModule],
//   useFactory: (appConfigService: AppConfigService) => appConfigService.getDatabaseConfig(),
//   inject: [AppConfigService],
// };

const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
  imports: [AppConfigModule],
  inject: [AppConfigService],
  useFactory: (appConfigService: AppConfigService) =>
    appConfigService.getDatabaseConfig(__dirname),
};

const mailerAsyncModule: MailerAsyncOptions = {
  useFactory: (appConfigService: AppConfigService) =>
    appConfigService.getSmtpConfiguration(__dirname),
  imports: [AppConfigModule],
  inject: [AppConfigService],
};

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
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
