import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule';
import { MessageController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRepository } from './repository/email.repository';
import { EmailMapper } from './mapper/email.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailRepository]),
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
  ],
  controllers: [MessageController],
  providers: [MessageService, EmailMapper],
  exports: [MessageService],
})
export class MessageModule {}
