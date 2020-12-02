import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RoleService } from './service/role.service';
import { SecurityController } from './controller/security.controller';
import { SecurityService } from './service/security.service';
import { ClientCredentialsRepository } from './repository/client-credentials.repository';
import { UserModule } from '../UserModule/user.module';
import { ClientCredentials } from './entity/client-credentials.entity';
import { RoleRepository } from './repository/role.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      RoleRepository,
      ClientCredentials,
      ClientCredentialsRepository,
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
    forwardRef(() => UserModule),
  ],
  controllers: [SecurityController],
  providers: [SecurityService, RoleService],
  exports: [SecurityService, RoleService, JwtModule],
})
export class SecurityModule {}
