import { Test } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewTestDTO {
    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    title: Test['title'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    correctAlternative: Test['correctAlternative'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    firstAlternative: Test['firstAlternative'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    secondAlternative: Test['secondAlternative'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    thirdAlternative: Test['thirdAlternative'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    fourthAlternative: Test['fourthAlternative'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    nextTest: Test['nextTest'];

    @IsString()
    @Expose()
    @ApiModelProperty({ type: String })
    part: Test['part'];
}