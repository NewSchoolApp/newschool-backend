export enum ChosenAlternativeEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export class CheckTestBodyDTO {
  chosenAlternative: ChosenAlternativeEnum;
}

export class CheckTestResponseDTO {
  isCorrect: boolean;
}
