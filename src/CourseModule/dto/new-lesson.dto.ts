import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class NewLessonDTO {
    @ApiModelProperty({ type: String })
    title: Lesson['title'];

    @ApiModelProperty({ type: String })
    description: Lesson['description'];

    @ApiModelProperty({ type: String })
    courseId: Lesson['courseId'];

    @ApiModelProperty({ type: String })
    nextLessonId: Lesson['nextLessonId'];
}
