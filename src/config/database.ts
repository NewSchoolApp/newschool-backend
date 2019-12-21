import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const database = (): MysqlConnectionOptions => {
      
  return {  
    type: 'mysql',    
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    multipleStatements: true,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    dropSchema: process.env.NODE_ENV === 'test',
    synchronize: process.env.NODE_ENV !== 'prod',
  };
};