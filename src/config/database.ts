import { ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const database = (configService: ConfigService): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST'),
    database: configService.get<string>('DATABASE_NAME'),
    multipleStatements: true,
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('SYNC_DATABASE'),
    logging: configService.get<string>('NODE_ENV') !== 'TEST',
  };
};
