import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entity/certificate.entity';
import { CertificateRepository } from './repository/certificate.repository';
import { CertificateController } from './controller/certificate.controller';
import { CertificateService } from './service/certificate.service';
import { CertificateMapper } from './mapper/certificate.mapper';

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
