import { Module } from '@nestjs/common';
import { CourseController, LessonController, PartController, TestController } from './controllers';
import { CourseService, LessonService, PartService, TestService } from './service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository, LessonRepository, PartRepository, TestRepository } from './repository';
import { Course, Lesson, Part, Test } from './entity';
import { CourseMapper, LessonMapper, PartMapper, TestMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '../UserModule';
import { SecurityModule } from '../SecurityModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseRepository, Lesson, LessonRepository, Part, PartRepository, Test, TestRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({ dest: './upload' }),
    UserModule,
    SecurityModule,
  ],
  controllers: [CourseController, LessonController, PartController, TestController],
  providers: [CourseService, CourseMapper, LessonService, LessonMapper, PartService, PartMapper, TestService, TestMapper],
  exports: [CourseService, LessonService, PartService, TestService],
})
export class CourseModule {
}
