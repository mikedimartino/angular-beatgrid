import {TimeSignature} from './time-signature.model';
import {GridSound} from './grid-sound.model';
import {Measure} from './measure.model';


export class Beat {
  id: number;
  name: string;
  tempo: number;
  timeSignature: TimeSignature;
  divisionLevel: number;
  sounds: GridSound[];
  measures: Measure[];
  columnsPerMeasure: number;
}
