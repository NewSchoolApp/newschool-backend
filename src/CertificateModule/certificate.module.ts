import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CertificateController } from './controller';
import { CertificateService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entity';
import { CertificateRepository } from './repository';
import { CertificateMapper } from './mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, CertificateRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CertificateController],
  providers: [CertificateService, CertificateMapper],
  exports: [CertificateService],
})
export class CertificateModule {}
