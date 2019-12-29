import { ApiModelProperty } from '@nestjs/swagger';

export class SMSSwagger {
  @ApiModelProperty({ type: String })  
  name: String;

  @ApiModelProperty({ type: String })  
  phone: String;

  @ApiModelProperty({ type: String })  
  message: String;

  @ApiModelProperty({ type: String })  
  title: String;
}
