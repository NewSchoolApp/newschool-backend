import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './CourseModule';


const typeOrmConfiguration = (): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    multipleStatements: true,
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    dropSchema: process.env.NODE_ENV === 'test',
    synchronize: process.env.NODE_ENV !== 'prod',
  };
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfiguration }),
    SecurityModule,
    UserModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
