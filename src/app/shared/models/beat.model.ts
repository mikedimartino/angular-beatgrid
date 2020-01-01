import {TimeSignature} from './time-signature.model';
import {GridSound} from './grid-sound.model';
import {Measure} from './measure.model';

export class Beat {
  id: string;
  name: string;
  tempo: number;
  timeSignature: TimeSignature;
  divisionLevel: number;
  sounds: GridSound[];
  measures: Measure[];
  measuresCondensed: string[][];
  columnsPerMeasure: number;
}
