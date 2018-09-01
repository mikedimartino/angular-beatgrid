import { Injectable } from '@angular/core';
import {TimeSignature} from '../shared/models/time-signature.model';

@Injectable()
export class BeatService {
  columns: number;
  tempo = 60;
  timeSignature = new TimeSignature(4, 4);
  divisionLevel = 16;

  constructor() {
    this.columns = this.calculateColumnCount();
  }

  private calculateColumnCount(): number {
    return (this.timeSignature.notesPerMeasure / this.timeSignature.noteType)
      * this.divisionLevel;
  }
}
