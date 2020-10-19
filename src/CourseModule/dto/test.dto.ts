import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Part } from '../entity/part.entity';
import { Test } from '../entity/test.entity';

export class TestDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: Test['id'];

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

  @IsNotEmptyObject()
  @Type(() => Part)
  @Expose()
  part: Test['part'];
}
