import { ApiModelProperty } from '@nestjs/swagger';

export class ContactUsSwagger {
  @ApiModelProperty({ type: String })  
  name: String;

  @ApiModelProperty({ type: String })  
  email: String;

  @ApiModelProperty({ type: String })  
  message: String;
}
