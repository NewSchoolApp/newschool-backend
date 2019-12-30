import { ApiModelProperty } from '@nestjs/swagger';
import { Part } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class PartUpdateDTO {
    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    title: Part['title'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    description: Part['description'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    vimeoUrl: Part['vimeoUrl'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    youtubeUrl: Part['youtubeUrl'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    lessonId: Part['lessonId'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    nextPartId: Part['nextPartId'];
}
