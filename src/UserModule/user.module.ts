import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule/security.module';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRepository,
      ChangePassword,
      ChangePasswordRepository,
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    forwardRef(() => SecurityModule),
    forwardRef(() => GameficationModule),
  ],
  controllers: [UserController, SchoolController],
  providers: [UserService, UserMapper, ChangePasswordService, SchoolService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
