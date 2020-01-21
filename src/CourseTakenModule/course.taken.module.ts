import { Module } from '@nestjs/common';
import { CourseTakenController } from './controllers';
import { CourseTakenService } from './service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseTakenRepository } from './repository';
import { CourseTaken } from './entity';
import { CourseTakenMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';
import { CourseModule } from '../CourseModule';
import { UserModule } from '../UserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseTaken, CourseTakenRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    CourseModule,
    UserModule,
  ],
  controllers: [CourseTakenController],
  providers: [CourseTakenService, CourseTakenMapper],
  exports: [CourseTakenService],
})
export class CourseTakenModule {}
