import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewCourseTakenDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;
}
