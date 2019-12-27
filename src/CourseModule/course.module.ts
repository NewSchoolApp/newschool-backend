import { CourseController, LessonController, PartController } from './controllers';
import { CourseService, LessonService, PartService } from './service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository, LessonRepository, PartRepository } from './repository';
import { Course, Lesson, Part } from './entity';
import { CourseMapper, LessonMapper, PartMapper } from './mapper';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TransactionMiddleware } from '@nest-kr/transaction';
import { getConnection } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [CourseController, LessonController, PartController],
  providers: [CourseService, CourseMapper, LessonService, LessonMapper, PartService, PartMapper],
  exports: [CourseService, LessonService, PartMapper],
})
export class CourseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionMiddleware(getConnection))
      .forRoutes(CourseController);
  }
}
