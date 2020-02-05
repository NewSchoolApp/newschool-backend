import { Test } from '../entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class TestUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Test['title'];

  @IsOptional()
  @IsString()
  @Expose()
  question?: Test['question'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  correctAlternative: Test['correctAlternative'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  firstAlternative: Test['firstAlternative'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  secondAlternative: Test['secondAlternative'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  thirdAlternative: Test['thirdAlternative'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  fourthAlternative: Test['fourthAlternative'];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  sequenceNumber: Test['sequenceNumber'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  partId: string;
}
