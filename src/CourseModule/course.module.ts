import { CacheModule, forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '../UserModule/user.module';
import { GameficationModule } from '../GameficationModule/gamefication.module';
import { CourseTakenMapper } from './mapper/course-taken.mapper';
import { CourseTaken } from './entity/course-taken.entity';
import { CourseTakenRepository } from './repository/course.taken.repository';
import { CommentRepository } from './repository/comment.repository';
import { UserLikedCommentRepository } from './repository/user-liked-comment.repository';
import { CommentController } from './controllers/comment.controller';
import { CommentMapper } from './mapper/comment.mapper';
import { CommentService } from './service/v1/comment.service';
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
import { CourseTakenService } from './service/v1/course-taken.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    TypeOrmModule.forFeature([
      CourseTaken,
      CourseTakenRepository,
      Comment,
      CommentRepository,
      UserLikedComment,
      UserLikedCommentRepository,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => GameficationModule),
    UploadModule,
  ],
  controllers: [
    CommentController,
    CourseV2Controller,
    LessonV2Controller,
    PartV2Controller,
    TestV2Controller,
    CourseTakenV2Controller,
  ],
  providers: [
    CourseTakenMapper,
    CommentMapper,
    CommentService,
    CmsIntegration,
    CourseV2Service,
    LessonV2Service,
    PartV2Service,
    TestV2Service,
    CourseTakenV2Service,
    CourseTakenService,
  ],
  exports: [CourseTakenService],
})
export class CourseModule {}
