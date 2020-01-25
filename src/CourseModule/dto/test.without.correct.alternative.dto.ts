import { Test } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class TestWithoutCorrectAlternativeDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  id: Test['id'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  title: Test['title'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  question: Test['question'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  firstAlternative: Test['firstAlternative'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  secondAlternative: Test['secondAlternative'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  thirdAlternative: Test['thirdAlternative'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  fourthAlternative: Test['fourthAlternative'];

  @IsNumber()
  @Expose()
  @ApiProperty({ type: Number })
  sequenceNumber: Test['sequenceNumber'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  part: Test['part'];
}
