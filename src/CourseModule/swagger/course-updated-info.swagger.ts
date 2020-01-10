import { ApiModelProperty } from '@nestjs/swagger';
import { Course } from '../entity';
import { User } from '../../UserModule';

export class CourseUpdatedInfoSwagger {
  @ApiModelProperty({ type: String })
  title: Course['title'];

  @ApiModelProperty({ type: String })
  thumbUrl: Course['thumbUrl'];

  @ApiModelProperty({ type: String })
  authorId: User['id'];
}
