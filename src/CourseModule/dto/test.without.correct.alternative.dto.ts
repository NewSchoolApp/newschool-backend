import { Test } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class TestWithoutCorrectAlternativeDTO {
  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  id: Test['id'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  title: Test['title'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  question: Test['question'];

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

  @IsNumber()
  @Expose()
  @ApiModelProperty({ type: Number })
  sequenceNumber: Test['sequenceNumber'];

  @IsString()
  @Expose()
  @ApiModelProperty({ type: String })
  part: Test['part'];
}
