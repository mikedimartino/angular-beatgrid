export class TimeSignature {
  notesPerMeasure: number;
  noteType: number; // Possible values: 1, 2, 4, 16, 32, 64, etc..

  constructor(notesPerMeasure: number, noteType: number) {
    this.notesPerMeasure = notesPerMeasure;
    this.noteType = noteType;
  }
}
