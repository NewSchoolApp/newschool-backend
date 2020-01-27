import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './CourseModule';
import { CourseTakenModule } from './CourseTakenModule';
import { CertificateModule } from './CertificateModule';
import { MessageModule } from './MessageModule';
import { UploadModule } from './UploadModule';
import { AppConfigModule, AppConfigService } from './AppConfigModule';

// const typeOrmAsyncModule: TypeOrmModuleAsyncOptions = {
//   imports: [AppConfigModule],
//   useFactory: (appConfigService: AppConfigService) => appConfigService.getDatabaseConfig(),
//   inject: [AppConfigService],
// };

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) =>
        appConfigService.getDatabaseConfig(__dirname),
    }),
    MailerModule.forRootAsync({
      useFactory: async (appConfigService: AppConfigService) =>
        appConfigService.getSmtpConfiguration(__dirname),
      imports: [AppConfigModule],
      inject: [AppConfigService],
    }),
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
