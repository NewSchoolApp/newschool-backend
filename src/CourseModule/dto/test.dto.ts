import { Test } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class TestDTO {
  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  id: Test['id'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  title: Test['title'];

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  question: Test['question'];

  @IsString()
  @Expose()
  @ApiProperty({ type: String })
  correctAlternative: Test['correctAlternative'];

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
