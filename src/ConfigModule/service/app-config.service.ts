import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter, MailerOptions } from '@nest-modules/mailer';
import * as path from 'path';
import * as Pusher from 'pusher';
import * as Sentry from '@sentry/node';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  securityOauthTokenDetailsUrl: string = this.configService.get<string>(
    'SECURITY_OAUTH_TOKEN_DETAILS_URL',
  );

  private securityClientCredentialsName: string = this.configService.get<string>(
    'SECURITY_CLIENT_CREDENTIALS_NAME',
  );

  private securityClientCredentialsSecret: string = this.configService.get<string>(
    'SECURITY_CLIENT_CREDENTIALS_SECRET',
  );

  securityOauthTokenUrl: string = this.configService.get<string>(
    'SECURITY_OAUTH_TOKEN_URL',
  );

  jwtSecret: string = this.configService.get<string>('JWT_SECRET');
  refreshTokenSecret: string = this.configService.get<string>(
    'REFRESH_TOKEN_SECRET',
  );

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

  awsAccessKey: string = this.configService.get<string>('AWS_ACCESS_KEY');
  awsAccessKeySecret: string = this.configService.get<string>(
    'AWS_ACCESS_KEY_SECRET',
  );
  awsBucketEndpoint: string = this.configService.get<string>(
    'AWS_BUCKET_ENDPOINT',
  );
  awsUserBucket: string = this.configService.get<string>('AWS_USER_BUCKET');

  cmsUrl: string = this.configService.get<string>('CMS_URL');
  cmsIdentifier: string = this.configService.get<string>('CMS_IDENTIFIER');
  cmsPassword: string = this.configService.get<string>('CMS_PASSWORD');
  cmsJwt: string = this.configService.get<string>('CMS_JWT');

  public getSentryConfiguration(): Sentry.NodeOptions {
    return {
      dsn: this.configService.get<string>('SENTRY_URL'),
      tracesSampleRate: 1.0,
      enabled: this.nodeEnv !== 'TEST',
      environment: this.nodeEnv,
      attachStacktrace: true,
    };
  }

  public getChangePasswordFrontUrl(changePasswordRequestId: string): string {
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
      charset: 'utf8mb4_unicode_ci',
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

  getAwsConfiguration(): S3.Types.ClientConfiguration {
    return {
      accessKeyId: this.awsAccessKey,
      secretAccessKey: this.awsAccessKeySecret,
      region: 'us-east-2',
      signatureVersion: 'v4',
    };
  }

  getClientCredentialsBase64() {
    const joinedUpClientCredentials = `${this.securityClientCredentialsName}:${this.securityClientCredentialsSecret}`;
    return Buffer.from(joinedUpClientCredentials).toString('base64');
  }

  getCmsConfiguration() {
    return {
      cmsUrl: this.cmsUrl,
      cmsIdentifier: this.cmsIdentifier,
      cmsPassword: this.cmsPassword,
    };
  }
}
