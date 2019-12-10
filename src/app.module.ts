import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config/database';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './CourseModule';
import { MailerModule } from '@nest-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: database }),
    MailerModule.forRoot(mailConfiguration),
    SecurityModule,
    UserModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
