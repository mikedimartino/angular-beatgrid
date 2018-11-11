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
  measuresCondensed: string[][];
  columnsPerMeasure: number;

  static compressForStorage(beat: Beat): Beat {
    // TODO: Compress sounds
    const compressedBeat = <Beat> { ...beat };
    compressedBeat.measuresCondensed = compressedBeat.measures.map(measure => Measure.toBitStringArray(measure));
    compressedBeat.measures = null;
    return compressedBeat;
  }

  static decompressFromStorage(beat: Beat): Beat {
    const decompressedBeat = <Beat> { ...beat };
    decompressedBeat.measures = beat.measuresCondensed.map(bitString => Measure.fromBitStringArray(bitString));
    decompressedBeat.measuresCondensed = null;
    return decompressedBeat;
  }
}
