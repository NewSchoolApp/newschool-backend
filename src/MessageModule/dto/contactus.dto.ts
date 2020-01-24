import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ContactUsDTO {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  cellphone: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;

  @ApiModelPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @Expose()
  email: string;
}
