import { Module } from '@nestjs/common';
import { CourseController, LessonController, PartController } from './controllers';
import { CourseService, LessonService, PartService } from './service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository, LessonRepository, PartRepository } from './repository';
import { Course, Lesson, Part } from './entity';
import { CourseMapper, LessonMapper, PartMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseRepository, Lesson, LessonRepository, Part, PartRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }), 
    MulterModule.register({   dest: './upload', }),
  ],
  controllers: [CourseController, LessonController, PartController],
  providers: [CourseService, CourseMapper, LessonService, LessonMapper, PartService, PartMapper],
  exports: [CourseService, LessonService, PartMapper],
})
export class CourseModule {
}
