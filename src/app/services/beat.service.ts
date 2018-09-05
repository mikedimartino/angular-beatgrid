import { Injectable } from '@angular/core';
import {TimeSignature} from '../shared/models/time-signature.model';
import {Measure} from '../shared/models/measure.model';
import {Beat} from '../shared/models/beat.model';
import {GridSound} from '../shared/models/grid-sound.model';

export const mockSounds = [
  new GridSound(1, 'hihat', 'assets/sounds/hihat.wav'),
  new GridSound(2, 'snare', 'assets/sounds/snare.mp3'),
  new GridSound(3, 'kick', 'assets/sounds/kick.mp3'),
  new GridSound(4, 'hihat', 'assets/sounds/hihat.wav'),
  new GridSound(5, 'hihat', 'assets/sounds/hihat.wav'),
  new GridSound(6, 'hihat', 'assets/sounds/hihat.wav'),
  new GridSound(7, 'hihat', 'assets/sounds/hihat.wav'),
  new GridSound(8, 'hihat', 'assets/sounds/hihat.wav'),
];

@Injectable()
export class BeatService {
  private beat: Beat;

  get tempo(): number {
    return this.beat.tempo;
  }

  get timeSignature(): TimeSignature {
    return this.beat.timeSignature;
  }

  get divisionLevel(): number {
    return this.beat.divisionLevel;
  }

  get sounds(): GridSound[] {
    return this.beat.sounds;
  }

  get measures(): Measure[] {
    return this.beat.measures;
  }

  get columnsPerMeasure(): number {
    return this.beat.columnsPerMeasure;
  }

  get columnsPerNote(): number {
    return this.beat.divisionLevel / this.beat.timeSignature.noteType;
  }

  constructor() {
    this.beat = this.generateTestBeat();
  }

  getSoundByRow(row: number): GridSound {
    return this.beat.sounds[row];
  }

  private generateTestBeat(): Beat {
    const timeSignature = new TimeSignature(4, 4);
    const divisionLevel = 16;
    const columnsPerMeasure = this.calculateColumnsPerMeasure(timeSignature, divisionLevel);
    return <Beat> {
      id: 1,
      name: 'Test Beat 1',
      tempo: 60,
      timeSignature,
      divisionLevel,
      sounds: mockSounds,
      measures: [
        new Measure(mockSounds.length, columnsPerMeasure),
        new Measure(mockSounds.length, columnsPerMeasure)
      ],
      columnsPerMeasure
    };
  }

  private calculateColumnsPerMeasure(timeSignature: TimeSignature, divisionLevel: number): number {
    return (timeSignature.notesPerMeasure / timeSignature.noteType) * divisionLevel;
  }
}
