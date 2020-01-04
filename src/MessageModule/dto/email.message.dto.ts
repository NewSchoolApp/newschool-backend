import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class EmailMessageDTO {
    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    @Expose()
    id: string;

    @ApiModelProperty({ type: String })
    @IsNotEmpty()
    @Expose()
    title: string;

    @ApiModelProperty({ type: String })
    @Expose()
    message: string;
}
