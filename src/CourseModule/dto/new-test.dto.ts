import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Test } from '../entity/test.entity';

export class NewTestDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: Test['title'];

  @IsNotEmpty()
  @IsString()
  @Expose()
  question: Test['question'];

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
  @IsString()
  @Expose()
  partId: string;
}
