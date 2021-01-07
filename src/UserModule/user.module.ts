import { CacheModule, forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { ChangePassword } from './entity/change-password.entity';
import { ChangePasswordRepository } from './repository/change-password.repository';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserMapper } from './mapper/user.mapper';
import { ChangePasswordService } from './service/change-password.service';
import { SchoolController } from './controller/school.controller';
import { SchoolService } from './service/school.service';
import { GameficationModule } from '../GameficationModule/gamefication.module';
import { UploadModule } from '../UploadModule/upload.module';
import { CityController } from './controller/city.controller';
import { CityService } from './service/city.service';
import { StateService } from './service/state.service';
import { StateController } from './controller/state.controller';
import { SemearService } from './service/semear.service';
import { NotificationModule } from '../NotificationModule/notification.module';
import { School } from './entity/school.entity';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      User,
      School,
      UserRepository,
      ChangePassword,
      ChangePasswordRepository,
    ]),
    HttpModule,
    UploadModule,
    NotificationModule,
    forwardRef(() => GameficationModule),
  ],
  controllers: [
    UserController,
    SchoolController,
    CityController,
    StateController,
  ],
  providers: [
    UserService,
    UserMapper,
    ChangePasswordService,
    SchoolService,
    CityService,
    StateService,
    SemearService,
  ],
  exports: [UserService, UserMapper],
})
export class UserModule {}
