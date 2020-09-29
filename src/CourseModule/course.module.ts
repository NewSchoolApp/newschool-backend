import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { LessonRepository } from './repository/lesson.repository';
import { TestRepository } from './repository/test.repository';
import { CourseRepository } from './repository/course.repository';
import { CourseMapper } from './mapper/course.mapper';
import { TestService } from './service/test.service';
import { CourseService } from './service/course.service';
import { CourseController } from './controllers/course.controller';
import { LessonMapper } from './mapper/lesson.mapper';
import { PartService } from './service/part.service';
import { LessonController } from './controllers/lesson.controller';
import { Lesson } from './entity/lesson.entity';
import { PartController } from './controllers/part.controller';
import { SecurityModule } from '../SecurityModule/security.module';
import { TestMapper } from './mapper/test.mapper';
import { PartRepository } from './repository/part.repository';
import { Part } from './entity/part.entity';
import { TestController } from './controllers/test.controller';
import { UserModule } from '../UserModule/user.module';
import { Course } from './entity/course.entity';
import { LessonService } from './service/lesson.service';
import { PartMapper } from './mapper/part.mapper';
import { Test } from './entity/test.entity';
import { GameficationModule } from '../GameficationModule/gamefication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseRepository,
      Lesson,
      LessonRepository,
      Part,
      PartRepository,
      Test,
      TestRepository,
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({ dest: './upload' }),
    UserModule,
    SecurityModule,
    GameficationModule,
  ],
  controllers: [
    CourseController,
    LessonController,
    PartController,
    TestController,
  ],
  providers: [
    CourseService,
    CourseMapper,
    LessonService,
    LessonMapper,
    PartService,
    PartMapper,
    TestService,
    TestMapper,
  ],
  exports: [CourseService, LessonService, PartService, TestService],
})
export class CourseModule {}
