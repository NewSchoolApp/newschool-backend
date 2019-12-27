import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionMiddleware } from '@nest-kr/transaction';
import { CourseController } from './controllers';
import { CourseService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { CourseRepository } from './repository';
import { Course } from './entity';
import { CourseMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseMapper],
  exports: [CourseService],
})
export class CourseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionMiddleware(getConnection))
      .forRoutes(CourseController);
  }
}
