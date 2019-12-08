import { Module } from '@nestjs/common';
import { CourseController } from './controllers';
import { CourseService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './repository';
import { Course } from './entity';
import { CourseMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService],
})
export class CourseModule {
}
