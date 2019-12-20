import { forwardRef, Module } from '@nestjs/common';
import { ChangePasswordService, UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
    forwardRef(() => SecurityModule),
    CertificateModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, ChangePasswordService],
  exports: [UserService],
})
export class UserModule {
}
