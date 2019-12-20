import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CertificateController } from './controller';
import { CertificateService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entity';
import { CertificateRepository } from './repository';
import { CertificateMapper } from './mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
      CertificateRepository,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
  ],
  controllers: [CertificateController],
  providers: [
    CertificateService,
    CertificateMapper,
  ],
  exports: [
    CertificateService,
  ]
})
export class CertificateModule {
}
