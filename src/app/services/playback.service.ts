import { Injectable } from '@angular/core';
import {GridSound} from '../shared/models/grid-sound.model';
import {BeatService} from './beat.service';
import {Measure} from '../shared/models/measure.model';
import {PlaybackState} from '../shared/models/playback-state.model';

const schedulerFrequencyMs = 50;

@Injectable()
export class PlaybackService {
  private audioContext = new AudioContext();
  private audioBuffers: { [soundId: number]: AudioBuffer };
  private activeSoundsByColumn: number[][];
  private columnDurationMs: number;
  private playbackInterval: any;
  private lastColumnPlayed: number;
  private lastColumnPlaybackTime: number;
  private state: PlaybackState = <PlaybackState>{};

  get activeColumn(): number {
    return this.state.activeColumn;
  }

  get currentMeasureIndex(): number {
    return this.state.currentMeasureIndex;
  }

  get currentMeasure(): Measure {
    return this.state.currentMeasure;
  }

  constructor(private beatService: BeatService) {
    this.fetchSounds().then(() => console.log('Finished loading sounds.'));
    this.updateColumnDuration();
    this.lastColumnPlayed = -1;
    this.state.currentMeasureIndex = -1;

    this.activeSoundsByColumn = [];
    for (let c = 0; c < this.beatService.columnsPerMeasure; c++) {
      this.activeSoundsByColumn[c] = [];
    }

    this.state.currentMeasure = this.beatService.measures[0];
  }

  playSound(soundId: number, timeMs = 0) {
    const buf = this.audioBuffers[soundId];
    const source = this.audioContext.createBufferSource();
    source.buffer = buf;
    source.connect(this.audioContext.destination);
    source.start(timeMs / 1000);
  }

  setColumnSoundActive(column: number, row: number, active: boolean) {
    const activeSoundsColumn = this.activeSoundsByColumn[column];
    const soundId = this.beatService.getSoundByRow(row).id;
    if (active) {
      activeSoundsColumn.push(soundId);
    } else {
      const index = activeSoundsColumn.indexOf(soundId);
      if (index > -1) {
        activeSoundsColumn.splice(index, 1);
      }
    }
  }

  startPlayback() {
    this.lastColumnPlaybackTime = undefined;
    this.tryScheduleColumn();
    this.playbackInterval = setInterval(() => this.tryScheduleColumn(), schedulerFrequencyMs);
  }

  stopPlayback() {
    clearInterval(this.playbackInterval);
  }

  changeMeasure(previous = false) {
    const increment = previous ? -1 : 1;
    if (this.state.currentMeasureIndex === -1) {
      this.state.currentMeasureIndex = 0;
    }
    this.state.currentMeasureIndex = Math.abs((this.currentMeasureIndex + increment) % this.beatService.measures.length);
    this.state.currentMeasure = this.beatService.measures[this.currentMeasureIndex];
  }

  // Schedules column to be played (if necessary)
  private tryScheduleColumn() {
    if (!this.lastColumnPlaybackTime) {
      this.lastColumnPlaybackTime = (this.audioContext.currentTime * 1000) - this.columnDurationMs;
    }
    if (((this.audioContext.currentTime * 1000) + (schedulerFrequencyMs + 10)) - this.lastColumnPlaybackTime > this.columnDurationMs) {
      this.lastColumnPlaybackTime = this.lastColumnPlaybackTime + this.columnDurationMs;
      this.lastColumnPlayed = (this.lastColumnPlayed + 1) % this.beatService.columnsPerMeasure;
      if (this.lastColumnPlayed === 0) {
        this.state.currentMeasureIndex = (this.currentMeasureIndex + 1) % this.beatService.measures.length;
        this.state.currentMeasure = this.beatService.measures[this.currentMeasureIndex];
      }
      this.scheduleColumn(this.lastColumnPlayed, this.lastColumnPlaybackTime);
    }
  }

  private scheduleColumn(column: number, timeMs: number) {
    const nextColumnMs = timeMs - (this.audioContext.currentTime * 1000);
    setTimeout(() => this.state.activeColumn = column, nextColumnMs);

    this.activeSoundsByColumn[column].forEach(soundId => {
      this.playSound(soundId, timeMs);
    });
  }

  setActiveColumn(column: number) {
    this.lastColumnPlayed = (column - 1) % this.beatService.columnsPerMeasure;
    this.state.activeColumn = column;
  }

  updateColumnDuration() {
    this.columnDurationMs = 60000 / (this.beatService.tempo * this.beatService.columnsPerNote);
  }

  private fetchSounds(): Promise<any[] | void> {
    const promises = [];
    this.audioBuffers = [];
    for (let i = 0; i < this.beatService.sounds.length; i++) {
      const sound = this.beatService.getSoundByRow(i);
      promises.push(
        this.fetchSound(sound).then(buf => {
          this.audioBuffers[sound.id] = buf;
        }));
    }
    return Promise.all(promises);
  }

  private fetchSound(sound: GridSound): Promise<AudioBuffer> {
    return fetch(sound.filePath)
      .then(resp => resp.arrayBuffer())
      .then(buf => this.audioContext.decodeAudioData(buf))
      .catch(err => {
        console.log('Failed to fetch sound', err);
        return <AudioBuffer>{};
      });
  }
}
