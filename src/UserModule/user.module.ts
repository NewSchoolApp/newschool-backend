import { forwardRef, Module } from '@nestjs/common';
import { ChangePasswordService, UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordRepository, UserRepository } from './repository';
import { ChangePassword, User } from './entity';
import { UserMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule';
import { UserController } from './controller';
import { CertificateModule } from '../CertificateModule';

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
    forwardRef(() => SecurityModule),
    CertificateModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, ChangePasswordService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
