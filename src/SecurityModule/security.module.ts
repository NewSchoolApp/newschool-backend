import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecurityController } from './controller';
import { RoleService, SecurityService } from './service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCredentials, Role } from './entity';
import { ClientCredentialsRepository, RoleRepository } from './repository';
import { UserModule } from '../UserModule';

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
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [SecurityController],
  providers: [SecurityService, RoleService],
  exports: [
    SecurityService,
    RoleService,
  ],
})
export class SecurityModule {
}
