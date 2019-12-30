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
    lesson: Part['lesson'];

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    nextPart: Part['nextPart'];
}
