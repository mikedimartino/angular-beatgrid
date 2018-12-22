import { Injectable } from '@angular/core';
import { AudioService } from './audio.service';
import {BeatService} from './beat.service';
import {Measure} from '../shared/models/measure.model';
import {Subject, Subscription} from 'rxjs/index';

export class PlaybackState {
  activeColumn: number;
  currentMeasureIndex: number;
  currentMeasure: Measure;
  isPlaying: boolean;
}

const schedulerFrequencyMs = 50;

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  audioContext = new AudioContext();
  mediaDestNode = this.audioContext.createMediaStreamDestination();
  private audioBuffers: { [soundId: number]: AudioBuffer };
  private activeSoundsByMeasureColumn: string[][][]; // [measure][column][row]
  private columnDurationMs: number;
  private playbackInterval: any;
  private lastColumnPlayed = 0;
  private lastColumnPlaybackTime: number;
  private state: PlaybackState = <PlaybackState>{};
  private beatChangedSubscription: Subscription;

  currentMeasureChanged = new Subject();
  totalMeasuresToPlay: number;
  measuresPlayed: number;
  shouldKeepTrackOfMeasuresPlayed: boolean;
  stoppedPlaybackSubject = new Subject();

  constructor(private audioService: AudioService,
              private beatService: BeatService) {
    this.updateColumnDuration();
    this.state.currentMeasure = this.beatService.measures[0];
    this.state.currentMeasureIndex = 0;

    this.initActiveSounds();

    this.beatChangedSubscription = this.beatService.getBeatChangedObservable().subscribe(() => {
      this.updateActiveSounds();
      this.updateColumnDuration();
      this.state.currentMeasure = this.beatService.measures[this.currentMeasureIndex];
    });
  }

  get activeColumn(): number {
    return this.state.activeColumn;
  }

  get currentMeasureIndex(): number {
    return this.state.currentMeasureIndex;
  }

  get currentMeasure(): Measure {
    return this.state.currentMeasure;
  }

  get isPlaying(): boolean {
    return this.state.isPlaying;
  }

  playSound(soundKey: string, timeMs = 0) {
    this.audioService.playSound(soundKey, timeMs);
  }

  setColumnSoundActive(column: number, row: number, active: boolean, measureIndex = this.currentMeasureIndex) {
    const activeSoundsColumn = this.activeSoundsByMeasureColumn[measureIndex][column];
    const soundId = this.beatService.getSoundByRow(row).key;
    if (active && activeSoundsColumn.indexOf(soundId) < 0) {
      activeSoundsColumn.push(soundId);
    } else {
      const index = activeSoundsColumn.indexOf(soundId);
      if (index > -1) {
        activeSoundsColumn.splice(index, 1);
      }
    }
  }

  startPlayback() {
    this.state.isPlaying = true;
    this.lastColumnPlaybackTime = undefined;
    this.tryScheduleColumn();
    this.playbackInterval = setInterval(() => this.tryScheduleColumn(), schedulerFrequencyMs);
  }

  stopPlayback() {
    this.state.isPlaying = false;
    clearInterval(this.playbackInterval);

    this.totalMeasuresToPlay = 0;
    this.measuresPlayed = 0;
    this.shouldKeepTrackOfMeasuresPlayed = false;
    this.stoppedPlaybackSubject.next();
  }

  playBeat(times = 1) {
    this.changeMeasure(0);
    this.totalMeasuresToPlay = this.beatService.measures.length * times;
    this.measuresPlayed = 0;
    this.shouldKeepTrackOfMeasuresPlayed = true;
    this.startPlayback();
  }

  nextMeasure(previous = false) {
    const increment = previous ? -1 : 1;
    let index = Math.max(this.currentMeasureIndex, 0);
    index = Math.abs((index + increment) % this.beatService.measures.length);
    this.changeMeasure(index);
  }

  changeMeasure(index: number) {
    this.state.currentMeasureIndex = index;
    this.state.currentMeasure = this.beatService.measures[this.currentMeasureIndex];
    this.setActiveColumn(0);
    this.currentMeasureChanged.next();
  }

  setActiveColumn(column: number) {
    this.lastColumnPlayed = column;
    this.state.activeColumn = column;

    if (this.isPlaying) {
      this.stopPlayback();
      this.startPlayback();
    }
  }

  updateColumnDuration() {
    this.columnDurationMs = 60000 / (this.beatService.tempo * this.beatService.columnsPerNote);
  }

  initActiveSounds() {
    this.activeSoundsByMeasureColumn = [];
    for (let m = 0; m < this.beatService.measures.length; m++) {
      this.activeSoundsByMeasureColumn[m] = [];
      for (let c = 0; c < this.beatService.columnsPerMeasure; c++) {
        this.activeSoundsByMeasureColumn[m][c] = [];
      }
    }
  }

  updateActiveSounds() {
    this.initActiveSounds();
    for (let m = 0; m < this.beatService.measures.length; m++) {
      this.beatService.measures[m].squares.forEach(row => {
        row.forEach(square => {
          this.setColumnSoundActive(square.column, square.row, square.on, m);
        });
      });
    }
  }

  // Schedules column to be played (if necessary)
  private tryScheduleColumn() {
    if (!this.lastColumnPlaybackTime) {
      this.lastColumnPlaybackTime = (this.audioContext.currentTime * 1000);
    } else if (this.shouldSchedule()) {
      this.lastColumnPlaybackTime = this.lastColumnPlaybackTime + this.columnDurationMs;
      this.lastColumnPlayed = (this.lastColumnPlayed + 1) % this.beatService.columnsPerMeasure;
      if (this.lastColumnPlayed === 0) {
        this.state.currentMeasureIndex = (this.currentMeasureIndex + 1) % this.beatService.measures.length;
        this.state.currentMeasure = this.beatService.measures[this.currentMeasureIndex];
        if (this.shouldKeepTrackOfMeasuresPlayed && ++this.measuresPlayed === this.totalMeasuresToPlay) {
          this.stopPlayback();
          return;
        }
      }
    } else {
      return;
    }
    this.scheduleColumn(this.lastColumnPlayed, this.lastColumnPlaybackTime);
  }

  private shouldSchedule(): boolean {
    return ((this.audioContext.currentTime * 1000) + (schedulerFrequencyMs + 10)) - this.lastColumnPlaybackTime > this.columnDurationMs;
  }

  private scheduleColumn(column: number, timeMs: number) {
    const nextColumnMs = timeMs - (this.audioContext.currentTime * 1000);
    setTimeout(() => this.state.activeColumn = column, nextColumnMs);

    this.activeSoundsByMeasureColumn[this.currentMeasureIndex][column].forEach(soundId => {
      this.playSound(soundId, timeMs);
    });
  }

}
