import { Injectable } from '@angular/core';
import { TimeSignature } from '../shared/models/time-signature.model';
import { Measure } from '../shared/models/measure.model';
import { Beat } from '../shared/models/beat.model';
import { GridSound } from '../shared/models/grid-sound.model';
import { Observable, Subject } from 'rxjs/index';
import {ApiService} from './api.service';

const soundPathPrefix = 'assets/sounds/musicradar-drum-samples/Drum Kits/Kurzweil Kit 01/';
export const mockSounds = [
  new GridSound(1, 'closed hihat', soundPathPrefix + 'CYCdh_Kurz01-ClHat.wav'),
  new GridSound(2, 'open hihat', soundPathPrefix + 'CYCdh_Kurz01-OpHat01.wav'),
  new GridSound(3, 'ride', soundPathPrefix + 'CYCdh_Kurz01-Ride01.wav'),
  new GridSound(4, 'crash', soundPathPrefix + 'CYCdh_Kurz01-Crash01.wav'),
  new GridSound(5, 'tom 1', soundPathPrefix + 'CYCdh_Kurz01-Tom02.wav'),
  new GridSound(6, 'tom 2', soundPathPrefix + 'CYCdh_Kurz01-Tom04.wav'),
  new GridSound(7, 'snare', soundPathPrefix + 'CYCdh_Kurz01-Snr01.wav'),
  new GridSound(8, 'kick', soundPathPrefix + 'CYCdh_Kurz01-Kick01.wav')
];

@Injectable()
export class BeatService {
  beat: Beat;
  beats: Beat[] = [];
  beatChangedSubject = new Subject();
  isNew = false;

  constructor(private apiService: ApiService) {
    this.new();
    this.apiService.readBeats().subscribe(beats => {
      this.beats = beats;
      if (beats && beats.length) {
        this.selectBeat(beats[0].id);
      }
    });
  }

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
    if (!this.beat.measures || !this.beat.measures.length) {
      return 0;
    }
    return this.beat.measures[0].numColumns;
  }

  get rows(): number {
    if (!this.beat.measures || !this.beat.measures.length) {
      return 0;
    }
    return this.beat.measures[0].squares.length;
  }

  get columnsPerNote(): number {
    return this.beat.divisionLevel / this.beat.timeSignature.noteType;
  }

  selectBeat(id: number) {
    const selectedBeat = this.beats.find(beat => beat.id === id);
    if (selectedBeat) {
      this.beat = selectedBeat;
      this.isNew = false;
      this.onBeatChanged();
    }
  }

  setDivisionLevel(value: number): void {
    const newColumnCount = this.calculateColumnsPerMeasure(this.beat.timeSignature, value);
    if (value < this.divisionLevel) {
      this.beat.measures.forEach(measure => measure.collapseColumns(newColumnCount));
    } else if (value > this.divisionLevel) {
      this.beat.measures.forEach(measure => measure.expandColumns(newColumnCount));
    } else {
      return;
    }
    this.beat.divisionLevel = value;
    this.beat.columnsPerMeasure = this.calculateColumnsPerMeasure();
    this.onBeatChanged();
  }

  setTempo(value: number): void {
    this.beat.tempo = value;
  }

  setTimeSignature(value: TimeSignature) {
    this.beat.timeSignature = value;
    this.beat.columnsPerMeasure = this.calculateColumnsPerMeasure();
    this.beat.measures = this.beat.measures.map(() => {
      return new Measure(this.sounds.length, this.beat.columnsPerMeasure);
    });
    this.onBeatChanged();
  }

  getSoundByRow(row: number): GridSound {
    return this.beat.sounds[row];
  }

  getBeatChangedObservable(): Observable<any> {
    return this.beatChangedSubject.asObservable();
  }

  addMeasure() {
    const measure = new Measure(this.beat.sounds.length, this.columnsPerMeasure);
    this.beat.measures.push(measure);
    this.onBeatChanged();
  }

  save() {
    if (this.isNew) {
      this.isNew = false;
      this.apiService.createBeat(this.beat).subscribe(response => {
        this.beat.id = response.id;
        this.beats.push(this.beat);
      });
    }
  }

  new() {
    this.isNew = true;
    this.beat = this.generateNewBeat();
    this.onBeatChanged();
  }

  delete(id: number) {
    const index = this.beats.findIndex(b => b.id === id);
    if (index < 0) {
      return;
    }
    this.apiService.deleteBeat(id).subscribe(response => {
      this.beats.splice(index, 1);
      if (this.beats.length) {
        this.selectBeat(this.beats[0].id);
      } else {
        this.new();
      }
    }, error => {
      console.error('Error:', error);
    });
  }

  // TODO: Update name of this and related properties, since this is only for layout changes (and not tempo).
  private onBeatChanged(): void {
    this.beatChangedSubject.next();
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
        // new Measure(mockSounds.length, columnsPerMeasure),
        new Measure(mockSounds.length, columnsPerMeasure)
      ]
    };
  }

  private generateNewBeat(): Beat {
    const timeSignature = new TimeSignature(4, 4);
    const divisionLevel = 16;
    const columnsPerMeasure = this.calculateColumnsPerMeasure(timeSignature, divisionLevel);
    return <Beat> {
      id: undefined,
      name: 'New Beat',
      tempo: 60,
      timeSignature,
      divisionLevel,
      sounds: mockSounds,
      measures: [
        new Measure(mockSounds.length, columnsPerMeasure)
      ]
    };
  }

  private calculateColumnsPerMeasure(timeSignature: TimeSignature = null, divisionLevel: number = null): number {
    timeSignature = timeSignature || this.beat.timeSignature;
    divisionLevel = divisionLevel || this.beat.divisionLevel;
    return (timeSignature.notesPerMeasure / timeSignature.noteType) * divisionLevel;
  }
}
