import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class EmailDTO {  
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiModelProperty({ type: String })
  @Expose()
  message: string;
}
