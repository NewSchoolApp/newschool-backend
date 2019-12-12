import { Module } from '@nestjs/common';
import { SecurityController } from './controller';
import { SecurityService } from './service';
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
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
    UserModule,
  ],
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {
}
