import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from '../SecurityModule';
import { MessageController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from './repository/template.repository';
import { TemplateMapper } from './mapper/template.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateRepository]),
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
  providers: [MessageService, TemplateMapper],
  exports: [MessageService],
})
export class MessageModule {}
