import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings} from './Settings';

const settings = new Settings();

const typeOrmConfiguration = (): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    multipleStatements: true,
    database: settings.getDatabaseName(),
    port: Number(settings.getDatabasePort()),
    username: settings.getDatabaseUser(),
    password: settings.getDatabasePassword(),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    dropSchema: settings.getEnvironment() === 'test',
    synchronize: settings.getEnvironment() !== 'prod',
  };
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfiguration }),
    SecurityModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
