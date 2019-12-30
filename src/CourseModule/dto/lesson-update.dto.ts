import { ApiModelProperty } from '@nestjs/swagger';
import { Lesson } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class LessonUpdateDTO {
    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    title: Lesson['title'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    description: Lesson['description'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    courseId: Lesson['courseId'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    nextLessonId: Lesson['nextLessonId'];
}
