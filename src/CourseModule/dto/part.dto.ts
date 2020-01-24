import { Part } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PartDTO {
  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  id: Part['id'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  title: Part['title'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  description: Part['description'];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiModelProperty({ type: String })
  vimeoUrl: Part['vimeoUrl'];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiModelProperty({ type: String })
  youtubeUrl: Part['youtubeUrl'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  lesson: Part['lesson'];

  @IsNumber()
  @Expose()
  @ApiModelProperty({ type: Number })
  sequenceNumber: Part['sequenceNumber'];
}
