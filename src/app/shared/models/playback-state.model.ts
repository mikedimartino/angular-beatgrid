import {Measure} from './measure.model';

export class PlaybackState {
  activeColumn: number;
  currentMeasureIndex: number;
  currentMeasure: Measure;
  isPlaying: boolean;
}
