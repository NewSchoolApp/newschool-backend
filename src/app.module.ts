import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Settings} from './Settings';

const settings = new Settings();

const typeOrmConfiguration = (): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    database: settings.getDatabaseName(),
    port: Number(settings.getDatabasePort()),
    username: settings.getDatabaseUser(),
    password: settings.getDatabasePassword(),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: settings.getEnvironment() !== 'prod',
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
