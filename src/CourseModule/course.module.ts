import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CourseController } from './controllers';
import { CourseService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './repository';
import { Course } from './entity';
import { CourseMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseRepository]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }), 
    MulterModule.register({   dest: './upload', }),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService],
})
export class CourseModule {
}
