import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfiguration } from './config/typeOrmConfiguration';
import { SecurityModule } from './SecurityModule';
import { UserModule } from './UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';

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
