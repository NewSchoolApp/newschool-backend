import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NpsCourseTakenDTO {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  feedback: string;
}
