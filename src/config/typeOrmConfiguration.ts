import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const CONFIG = dotenv.parse(fs.readFileSync(__dirname + '/../../.env'))

export const typeOrmConfiguration = (): MysqlConnectionOptions => {
  
    return {
      type: 'mysql',
      host: CONFIG.DATABASE_HOST,
      database: CONFIG.DATABASE_NAME,
      multipleStatements: true,
      port: 3306,
      username: CONFIG.DATABASE_USERNAME,
      password: CONFIG.DATABASE_PASSWORD,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      dropSchema: CONFIG.NODE_ENV === 'test',
      synchronize: CONFIG.NODE_ENV !== 'prod',
    };
  };