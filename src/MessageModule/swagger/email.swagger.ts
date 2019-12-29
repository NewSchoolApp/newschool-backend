import { ApiModelProperty } from '@nestjs/swagger';

export class EmailSwagger {
  @ApiModelProperty({ type: String })  
  name: String;

  @ApiModelProperty({ type: String })  
  email: String;

  @ApiModelProperty({ type: String })  
  title: String;

  @ApiModelProperty({ type: String })  
  message: String;
}
