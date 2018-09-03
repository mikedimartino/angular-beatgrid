import {TimeSignature} from './time-signature.model';

export class Beat {
  id: number;
  name: string;
  filePath: string;
  columns: number;
  tempo = 60;
  timeSignature = new TimeSignature(4, 4);
  divisionLevel = 16;
}
