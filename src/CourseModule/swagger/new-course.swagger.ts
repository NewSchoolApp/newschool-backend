import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../UserModule/entity/user.entity';
import { Course } from '../entity/course.entity';

export class NewCourseSwagger {
  @ApiProperty({ type: String })
  title: Course['title'];

  @ApiProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiProperty({ type: String })
  authorId: User['id'];
}
