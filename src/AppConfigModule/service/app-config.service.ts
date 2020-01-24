import { Injectable } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getDatabaseConfig(): MysqlConnectionOptions {
    console.log('to aqui');
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      database: this.configService.get<string>('DATABASE_NAME'),
      multipleStatements: true,
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>('SYNC_DATABASE'),
      logging: this.configService.get<string>('NODE_ENV') !== 'TEST',
    };
  }
}
