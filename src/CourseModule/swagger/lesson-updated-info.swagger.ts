import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';

export class LessonUpdatedInfoSwagger {
    @ApiModelProperty({ type: String })
    title: Lesson['title'];

    @ApiModelProperty({ type: String })
    description: Lesson['description'];

    @ApiModelProperty({ type: String })
    courseId: Lesson['courseId'];

    @ApiModelProperty({ type: String })
    nextLessonId: Lesson['nextLessonId'];
}