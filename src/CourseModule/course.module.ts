import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('EXPIRES_IN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService],
})
export class CourseModule {
}
