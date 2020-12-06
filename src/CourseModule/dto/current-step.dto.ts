import { CMSPartDTO } from './cms-part.dto';
import { CMSTestDTO } from './cms-test.dto';

export enum CurrentStepDoingEnum {
  COMPLETED = 'COMPLETED',
  PART = 'PART',
  TEST = 'TEST',
  CHALLENGE = 'CHALLENGE',
}

export class CurrentStepDTO {
  doing: CurrentStepDoingEnum;
  part?: CMSPartDTO;
  test?: Omit<CMSTestDTO, 'alternativa_certa'>;
}
