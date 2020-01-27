import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';
import Rollbar = require('rollbar');
import { HandlebarsAdapter } from '@nest-modules/mailer';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getRollbarConfiguration(): Rollbar.Configuration {
    return {
      accessToken: this.configService.get<string>('ROLLBAR_TOKEN'),
      captureUncaught: true,
      captureUnhandledRejections: true,
    };
  }

  public getSmtpConfiguration(dirname) {
    return {
      transport: {
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        secure: this.configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
      },
      template: {
        dir: dirname + '/../templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    };
  }

  public getDatabaseConfig(dirname): MysqlConnectionOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      database: this.configService.get<string>('DATABASE_NAME'),
      multipleStatements: true,
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      entities: [dirname + '/**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>('SYNC_DATABASE'),
      logging: this.configService.get<string>('NODE_ENV') !== 'TEST',
    };
  }
}
