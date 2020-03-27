import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { User } from '../../UserModule';

export class NewCourseSwagger {
  @ApiProperty({ type: String })
  title: Course['title'];

  @ApiProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiProperty({ type: String })
  authorId: User['id'];
}
