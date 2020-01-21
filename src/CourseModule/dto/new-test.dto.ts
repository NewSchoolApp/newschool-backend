import { Test } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewTestDTO {
  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  title: Test['title'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  question: Test['question'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  correctAlternative: Test['correctAlternative'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  firstAlternative: Test['firstAlternative'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  secondAlternative: Test['secondAlternative'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  thirdAlternative: Test['thirdAlternative'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  fourthAlternative: Test['fourthAlternative'];

  @IsString()
  @Expose()
  @IsNotEmpty()
  @ApiModelProperty({ type: String })
  part: Test['part'];
}
