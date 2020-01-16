import { Module } from '@nestjs/common';
import { UploadController } from './controllers';
import { UploadService } from './service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {
}
