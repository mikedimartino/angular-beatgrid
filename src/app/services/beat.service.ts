import { Injectable } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { BeatDetailsComponent } from '../components/beat-details/beat-details.component';
import { TimeSignature } from '../shared/models/time-signature.model';
import { Measure } from '../shared/models/measure.model';
import { Beat } from '../shared/models/beat.model';
import { GridSound } from '../shared/models/grid-sound.model';
import { Observable, Subject } from 'rxjs/index';
import {ApiService} from './api.service';
import {GridSquare} from '../shared/models/grid-square.model';
import {SoundService} from './sound.service';

// const soundPathPrefix = 'assets/sounds/musicradar-drum-samples/Drum Kits/Kurzweil Kit 01/';
// export const mockSounds = [
//   new GridSound(1, 'closed hihat', soundPathPrefix + 'CYCdh_Kurz01-ClHat.wav'),
//   new GridSound(2, 'open hihat', soundPathPrefix + 'CYCdh_Kurz01-OpHat01.wav'),
//   new GridSound(3, 'ride', soundPathPrefix + 'CYCdh_Kurz01-Ride01.wav'),
//   new GridSound(4, 'crash', soundPathPrefix + 'CYCdh_Kurz01-Crash01.wav'),
//   new GridSound(5, 'tom 1', soundPathPrefix + 'CYCdh_Kurz01-Tom02.wav'),
//   new GridSound(6, 'tom 2', soundPathPrefix + 'CYCdh_Kurz01-Tom04.wav'),
//   new GridSound(7, 'snare', soundPathPrefix + 'CYCdh_Kurz01-Snr01.wav'),
//   new GridSound(8, 'kick', soundPathPrefix + 'CYCdh_Kurz01-Kick01.wav')
// ];

export interface BeatChangedEvent {
  shouldStopPlayback: boolean;
}

const defaultSounds: GridSound[] = [
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Crash01.mp3', 'Crash 1'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Ride01.mp3', 'Ride 1'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Tom01.mp3', 'Tom 1'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Tom02.mp3', 'Tom 2'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-OpHat01.mp3', 'Open Hi-Hat 1'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-ClHat.mp3', 'Closed Hi-Hat'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Snr01.mp3', 'Snare 1'),
  new GridSound('Drum Kits/Kurzweil Kit 01/CYCdh_Kurz01-Kick01.mp3', 'Kick 1'),
];

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  beat: Beat;
  beats: Beat[] = [];
  beatChangedSubject = new Subject<BeatChangedEvent>();
  isNew = false;
  loading = false;

  constructor(private apiService: ApiService,
              private dialog: MatDialog,
              private soundService: SoundService) {
    this.loading = true;
    this.new();
    this.apiService.readBeats().subscribe(beats => {
      this.beats = beats;
      if (beats && beats.length) {
        this.selectBeat(beats[0].id);
      }
      this.soundService.downloadSounds(this.sounds);
      this.onBeatChanged();
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
    return Measure.getNumColumns(this.beat.measures[0]);
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

  selectBeat(id: string) {
    const selectedBeat = this.beats.find(beat => beat.id === id);
    if (selectedBeat) {
      this.beat = selectedBeat;
      this.isNew = false;
      this.onBeatChanged({ shouldStopPlayback: true });
    }
  }

  setDivisionLevel(value: number): void {
    const newColumnCount = this.calculateColumnsPerMeasure(this.beat.timeSignature, value);
    if (value < this.divisionLevel) {
      this.beat.measures.forEach(measure => Measure.collapseColumns(measure, newColumnCount));
    } else if (value > this.divisionLevel) {
      this.beat.measures.forEach(measure => Measure.expandColumns(measure, newColumnCount));
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
    return this.sounds[row];
  }

  changeSound(row: number, newSoundKey: string) {
    this.sounds[row] = new GridSound(newSoundKey, newSoundKey);
  }

  getBeatChangedObservable(): Observable<any> {
    return this.beatChangedSubject.asObservable();
  }

  addRow(index: number) {
    this.measures.forEach(measure => Measure.addRow(measure, index + 1));
    this.sounds.splice(index + 1, 0, this.sounds[index]);
  }

  moveRow(prevIndex: number, newIndex: number) {
    const sound = this.sounds[prevIndex];
    this.sounds.splice(prevIndex, 1);
    this.sounds.splice(newIndex, 0, sound);
    this.measures.forEach(measure => Measure.moveRow(measure, prevIndex, newIndex));
  }

  deleteRow(index: number) {
    if (this.rows > 1) {
      this.measures.forEach(measure => Measure.deleteRow(measure, index));
      this.sounds.splice(index, 1);
      this.onBeatChanged();
    }
  }

  cloneMeasure(index: number) {
    const clone = JSON.parse(JSON.stringify(this.measures[index]));
    this.measures.push(clone);
    this.onBeatChanged();
  }

  addMeasure() {
    const measure = new Measure(this.sounds.length, this.columnsPerMeasure);
    this.measures.push(measure);
    this.onBeatChanged();
  }

  deleteMeasure(index) {
    this.beat.measures.splice(index, 1);
    this.onBeatChanged();
  }

  deleteSquares(squares: GridSquare[]): void {
    this.modifySquares(squares, square => square.on = false);
  }

  fillSquares(squares: GridSquare[]): void {
    this.modifySquares(squares, square => square.on = true);
  }

  modifySquares(squares: GridSquare[], func: (square: GridSquare) => void) {
    squares.forEach(square => func(square));
    this.onBeatChanged();
  }

  save() {
    if (this.isNew) {
      this.isNew = false;

      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'no-padding';
      const dialogRef = this.dialog.open(BeatDetailsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        this.beat.name = result;
        this.apiService.createBeat(this.beat).subscribe(response => {
          this.beat.id = response.id;
          this.beats.push(this.beat);
        });
      });
    } else {
      this.apiService.updateBeat(this.beat).subscribe(response => {
        console.log('Updated beat');
      });
    }
  }

  new() {
    this.isNew = true;
    this.beat = this.generateNewBeat();
    this.onBeatChanged({ shouldStopPlayback: true });
  }

  delete(id: string) {
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

  onBeatChanged(eventArgs?: BeatChangedEvent): void {
    this.beatChangedSubject.next(eventArgs);
  }

  private generateTestBeat(): Beat {
    const timeSignature = new TimeSignature(4, 4);
    const divisionLevel = 16;
    const columnsPerMeasure = this.calculateColumnsPerMeasure(timeSignature, divisionLevel);
    return <Beat> {
      id: '1',
      name: 'Test Beat 1',
      tempo: 60,
      timeSignature,
      divisionLevel,
      sounds: defaultSounds,
      measures: [
        new Measure(defaultSounds.length, columnsPerMeasure)
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
      sounds: defaultSounds,
      measures: [
        new Measure(defaultSounds.length, columnsPerMeasure)
      ]
    };
  }

  private calculateColumnsPerMeasure(timeSignature: TimeSignature = null, divisionLevel: number = null): number {
    timeSignature = timeSignature || this.beat.timeSignature;
    divisionLevel = divisionLevel || this.beat.divisionLevel;
    return (timeSignature.notesPerMeasure / timeSignature.noteType) * divisionLevel;
  }
}
