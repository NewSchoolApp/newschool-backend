import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ChosenAlternativeEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export class CheckTestBodyDTO {
  @IsNotEmpty()
  @IsEnum(ChosenAlternativeEnum)
  chosenAlternative: ChosenAlternativeEnum;
}

export class CheckTestResponseDTO {
  isCorrect: boolean;
}
