import { Injectable } from '@angular/core';
import {GridSound} from '../shared/models/grid-sound.model';
import {BeatService} from './beat.service';

const mockSounds = [
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
export class PlaybackService {
  sounds: GridSound[] = mockSounds;
  audioContext = new AudioContext();
  audioBuffers: { [soundId: number]: AudioBuffer };
  activeSoundsByColumn: number[][];
  columnDuration: number; // Playback duration of each column in seconds

  constructor(private beatService: BeatService) {
    this.fetchSounds().then(() => console.log('Finished loading sounds.'));
    this.updateColumnDuration();

    this.activeSoundsByColumn = [];
    for (let c = 0; c < this.beatService.columns; c++) {
      this.activeSoundsByColumn[c] = [];
    }
  }

  playSound(sound: GridSound) {
    const buf = this.audioBuffers[sound.id];
    const source = this.audioContext.createBufferSource();
    source.buffer = buf;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  setColumnSoundActive(column: number, row: number, active: boolean) {
    const activeSoundsColumn = this.activeSoundsByColumn[column];
    if (active) {
      activeSoundsColumn.push(row);
    } else {
      const index = activeSoundsColumn.indexOf(row);
      if (index > -1) {
        activeSoundsColumn.splice(index, 1);
      }
    }
  }

  private fetchSounds(): Promise<any[] | void> {
    const promises = [];
    this.audioBuffers = [];
    for (let i = 0; i < this.sounds.length; i++) {
      const sound = this.sounds[i];
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

  private updateColumnDuration() {
    const columnsPerBeat = this.beatService.divisionLevel / this.beatService.timeSignature.noteType;
    this.columnDuration = this.beatService.tempo * 60 * columnsPerBeat;
  }
}
