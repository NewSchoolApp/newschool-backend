import { CacheModule, forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { CourseTakenService } from './service/course.taken.service';
import { CourseTakenController } from './controllers/course.taken.controller';
import { CourseTakenMapper } from './mapper/course-taken.mapper';
import { CourseTaken } from './entity/course.taken.entity';
import { CourseTakenRepository } from './repository/course.taken.repository';
import { CommentRepository } from './repository/comment.repository';
import { UserLikedCommentRepository } from './repository/user-liked-comment.repository';
import { CommentController } from './controllers/comment.controller';
import { CommentMapper } from './mapper/comment.mapper';
import { CommentService } from './service/comment.service';
import { Comment } from './entity/comment.entity';
import { UserLikedComment } from './entity/user-liked-comment.entity';
import { UploadModule } from '../UploadModule/upload.module';
import { CmsIntegration } from './integration/cms.integration';
import { CourseV2Service } from './service/v2/course-v2.service';
import { CourseV2Controller } from './controllers/v2/course-v2.controller';
import { LessonV2Controller } from './controllers/v2/lesson-v2.controller';
import { LessonV2Service } from './service/v2/lesson-v2.service';
import { PartV2Service } from './service/v2/part-v2.service';
import { PartV2Controller } from './controllers/v2/part-v2.controller';
import { TestV2Service } from './service/v2/test-v2.service';
import { TestV2Controller } from './controllers/v2/test-v2.controller';
import { CourseTakenV2Controller } from './controllers/v2/course-taken-v2.controller';
import { CourseTakenV2Service } from './service/v2/course-taken-v2.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    TypeOrmModule.forFeature([
      Course,
      CourseRepository,
      Lesson,
      LessonRepository,
      Part,
      PartRepository,
      Test,
      TestRepository,
      CourseTaken,
      CourseTakenRepository,
      Comment,
      CommentRepository,
      UserLikedComment,
      UserLikedCommentRepository,
    ]),
    MulterModule.register({ dest: './upload' }),
    forwardRef(() => UserModule),
    forwardRef(() => GameficationModule),
    UploadModule,
  ],
  controllers: [
    CourseController,
    LessonController,
    PartController,
    TestController,
    CourseTakenController,
    CommentController,
    CourseV2Controller,
    LessonV2Controller,
    PartV2Controller,
    TestV2Controller,
    CourseTakenV2Controller,
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
    CourseTakenService,
    CourseTakenMapper,
    CommentMapper,
    CommentService,
    CmsIntegration,
    CourseV2Service,
    LessonV2Service,
    PartV2Service,
    TestV2Service,
    CourseTakenV2Service,
  ],
  exports: [
    CourseService,
    LessonService,
    PartService,
    TestService,
    CourseTakenService,
  ],
})
export class CourseModule {}
