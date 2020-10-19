import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter, MailerOptions } from '@nest-modules/mailer';
import * as path from 'path';
import * as Pusher from 'pusher';
import Rollbar = require('rollbar');

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  jwtSecret: string = this.configService.get<string>('JWT_SECRET');

  changePasswordExpirationTime: number = this.configService.get<number>(
    'CHANGE_PASSWORD_EXPIRATION_TIME',
  );

  nodeEnv: string = this.configService.get<string>('NODE_ENV');
  port: number = this.configService.get<number>('PORT');

  expiresInAccessToken: string = this.configService.get<string>(
    'EXPIRES_IN_ACCESS_TOKEN',
  );
  expiresInRefreshToken: string = this.configService.get<string>(
    'EXPIRES_IN_REFRESH_TOKEN',
  );

  smtpHost: string = this.configService.get<string>('SMTP_HOST');
  smtpPort: number = this.configService.get<number>('SMTP_PORT');
  smtpSecure: boolean | undefined = this.configService.get<boolean | undefined>(
    'SMTP_SECURE',
  );
  smtpRequireTls: boolean = this.configService.get<boolean>('SMTP_REQUIRE_TLS');
  smtpUser: string = this.configService.get<string>('SMTP_USER');
  smtpPassword: string = this.configService.get<string>('SMTP_PASSWORD');
  smtpFrom: string = this.configService.get<string>('SMTP_FROM');

  emailContactUs: string = this.configService.get<string>('EMAIL_CONTACTUS');
  frontUrl: string = this.configService.get<string>('FRONT_URL');
  changePasswordFrontUrl: string = this.configService.get<string>(
    'CHANGE_PASSWORD_URL',
  );

  databaseHost: string = this.configService.get<string>('DATABASE_HOST');
  databaseName: string = this.configService.get<string>('DATABASE_NAME');
  databasePort: number = this.configService.get<number>('DATABASE_PORT');
  databaseUsername: string = this.configService.get<string>(
    'DATABASE_USERNAME',
  );
  databasePassword: string = this.configService.get<string>(
    'DATABASE_PASSWORD',
  );
  synchronize: boolean = this.configService.get<string>('NODE_ENV') === 'TEST';
  logging: boolean = this.configService.get<string>('NODE_ENV') !== 'TEST';
  runMigrations: boolean =
    this.configService.get<string>('NODE_ENV') !== 'TEST';

  pusherAppId: string = this.configService.get<string>('PUSHER_APP_ID');
  pusherKey: string = this.configService.get<string>('PUSHER_KEY');
  pusherSecret: string = this.configService.get<string>('PUSHER_SECRET');
  pusherCluster: string = this.configService.get<string>('PUSHER_CLUSTER');

  public getRollbarConfiguration(): Rollbar.Configuration {
    return {
      accessToken: this.configService.get<string>('ROLLBAR_TOKEN'),
      captureUncaught: true,
      captureUnhandledRejections: true,
    };
  }

  public getChangePasswordFrontUrl(changePasswordRequestId): string {
    return `${this.frontUrl}/${this.changePasswordFrontUrl}/${changePasswordRequestId}`;
  }

  public getSmtpConfiguration(): MailerOptions {
    return {
      transport: {
        host: this.smtpHost,
        port: this.smtpPort,
        secure: this.smtpSecure,
        requireTLS: this.smtpRequireTls,
        auth: {
          user: this.smtpUser,
          pass: this.smtpPassword,
        },
      },
      template: {
        dir: path.resolve(path.join(__dirname, '..', '..')) + '/../templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    };
  }

  public getDatabaseConfig(): MysqlConnectionOptions {
    return {
      type: 'mysql',
      multipleStatements: true,
      entities: [
        `${path.resolve(
          path.join(__dirname, '..', '..'),
        )}/**/*.entity{.ts,.js}`,
      ],
      migrationsRun: this.runMigrations,
      migrations: [
        `${path.resolve(
          path.join(__dirname, '..', '..'),
        )}/migration/*{.ts,.js}`,
      ],
      migrationsTableName: 'migration',
      cli: {
        migrationsDir: 'src/migration',
      },
      host: this.databaseHost,
      database: this.databaseName,
      port: this.databasePort,
      username: this.databaseUsername,
      password: this.databasePassword,
      synchronize: this.synchronize || false,
      logging: this.logging,
    };
  }

  public getPusherOptions(): Pusher.Options {
    return {
      appId: this.pusherAppId,
      key: this.pusherKey,
      secret: this.pusherSecret,
      cluster: this.pusherCluster,
      useTLS: true,
    };
  }
}
