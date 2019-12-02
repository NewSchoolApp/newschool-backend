import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const typeOrmConfiguration = (): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.DATABASE_ENV !== 'prod',
  };
};

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({ useFactory: typeOrmConfiguration }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
