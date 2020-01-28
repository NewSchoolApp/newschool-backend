import { Test } from '../entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class NewTestDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Test['title'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  question: Test['question'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  correctAlternative: Test['correctAlternative'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  firstAlternative: Test['firstAlternative'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  secondAlternative: Test['secondAlternative'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  thirdAlternative: Test['thirdAlternative'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  fourthAlternative: Test['fourthAlternative'];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  partId: string;
}
