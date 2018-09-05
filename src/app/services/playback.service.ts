// https://www.html5rocks.com/en/tutorials/audio/scheduling/

import { Injectable } from '@angular/core';
import {GridSound} from '../shared/models/grid-sound.model';
import {BeatService, mockSounds} from './beat.service';
import {Measure} from '../shared/models/measure.model';

const schedulerFrequencyMs = 50;

@Injectable()
export class PlaybackService {
  // sounds: GridSound[] = mockSounds;
  audioContext = new AudioContext();
  audioBuffers: { [soundId: number]: AudioBuffer };
  activeSoundsByColumn: number[][];
  columnDurationMs: number; // Playback duration of each column in seconds
  playbackInterval: any;
  lastColumnPlayed: number;
  lastColumnPlaybackTime: number;
  activeColumn = 0;
  currentMeasureIndex = 0;
  currentMeasure: Measure;

  constructor(private beatService: BeatService) {
    this.fetchSounds().then(() => console.log('Finished loading sounds.'));
    this.updateColumnDuration();
    this.lastColumnPlayed = -1;
    this.currentMeasureIndex = -1;

    this.activeSoundsByColumn = [];
    for (let c = 0; c < this.beatService.beat.columnsPerMeasure; c++) {
      this.activeSoundsByColumn[c] = [];
    }

    this.currentMeasure = this.beatService.beat.measures[0];
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
    const soundId = this.beatService.beat.sounds[row].id;
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
    if (this.currentMeasureIndex === -1) {
      this.currentMeasureIndex = 0;
    }
    this.currentMeasureIndex = Math.abs((this.currentMeasureIndex + increment) % this.beatService.beat.measures.length);
    this.currentMeasure = this.beatService.beat.measures[this.currentMeasureIndex];
  }

  // Schedules column to be played (if necessary)
  private tryScheduleColumn() {
    if (!this.lastColumnPlaybackTime) {
      this.lastColumnPlaybackTime = (this.audioContext.currentTime * 1000) - this.columnDurationMs;
    }
    if (((this.audioContext.currentTime * 1000) + (schedulerFrequencyMs + 10)) - this.lastColumnPlaybackTime > this.columnDurationMs) {
      this.lastColumnPlaybackTime = this.lastColumnPlaybackTime + this.columnDurationMs;
      this.lastColumnPlayed = (this.lastColumnPlayed + 1) % this.beatService.beat.columnsPerMeasure;
      if (this.lastColumnPlayed === 0) {
        this.currentMeasureIndex = (this.currentMeasureIndex + 1) % this.beatService.beat.measures.length;
        this.currentMeasure = this.beatService.beat.measures[this.currentMeasureIndex];
      }
      this.scheduleColumn(this.lastColumnPlayed, this.lastColumnPlaybackTime);
    }
  }

  private scheduleColumn(column: number, timeMs: number) {
    const nextColumnMs = timeMs - (this.audioContext.currentTime * 1000);
    setTimeout(() => this.activeColumn = column, nextColumnMs);

    this.activeSoundsByColumn[column].forEach(soundId => {
      this.playSound(soundId, timeMs);
    });
  }

  setActiveColumn(column: number) {
    this.lastColumnPlayed = (column - 1) % this.beatService.beat.columnsPerMeasure;
    this.activeColumn = column;
  }

  updateColumnDuration() {
    const columnsPerBeat = this.beatService.beat.divisionLevel / this.beatService.beat.timeSignature.noteType;
    this.columnDurationMs = 60000 / (this.beatService.beat.tempo * columnsPerBeat);
  }

  private fetchSounds(): Promise<any[] | void> {
    const promises = [];
    this.audioBuffers = [];
    for (let i = 0; i < this.beatService.beat.sounds.length; i++) {
      const sound = this.beatService.beat.sounds[i];
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
