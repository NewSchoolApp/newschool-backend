import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CourseModule } from '../CourseModule/course.module';
import { UserModule } from '../UserModule/user.module';
import { CourseTakenRepository } from './repository/course.taken.repository';
import { CourseTakenMapper } from './mapper/course-taken.mapper';
import { CourseTakenService } from './service/course.taken.service';
import { CourseTakenController } from './controllers/course.taken.controller';
import { CourseTaken } from './entity/course.taken.entity';

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
