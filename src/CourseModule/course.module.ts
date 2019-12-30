import { Module } from '@nestjs/common';
import { CourseController, LessonController, PartController } from './controllers';
import { CourseService, LessonService, PartService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository, LessonRepository, PartRepository } from './repository';
import { Course, Lesson, Part } from './entity';
import { CourseMapper, LessonMapper, PartMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseRepository, Lesson, LessonRepository, Part, PartRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
  ],
  controllers: [CourseController, LessonController, PartController],
  providers: [CourseService, CourseMapper, LessonService, LessonMapper, PartService, PartMapper],
  exports: [CourseService, LessonService, PartMapper],
})
export class CourseModule {
}
