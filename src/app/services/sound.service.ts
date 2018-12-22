import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { S3Object } from '../shared/interfaces';
import { GridSound } from '../shared/models/grid-sound.model';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  s3Cache = {};
  audioBuffers: { [key: string]: AudioBuffer } = {};
  audioContext = new AudioContext();

  constructor(private apiService: ApiService) {}

  getSoundsByFolder(folder: string = ''): Observable<S3Object[]> {
    if (this.s3Cache[folder]) {
      return of(this.s3Cache[folder]);
    }

    return this.apiService.readSoundsByFolder(folder).pipe(map((objects: S3Object[]) => {
      this.s3Cache[folder] = objects;
      const sounds = objects.map(obj => new GridSound(obj.key, obj.key));
      this.downloadSounds(sounds);
      return objects;
    }));
  }

  downloadSounds(sounds: GridSound[]): Observable<any> {
    const observables = [];
    sounds.map(sound => sound.key).filter(key => !key.endsWith('/')).forEach(key => {
      if (!this.audioBuffers[key]) {
        const dlSoundObservable = this.apiService.downloadSound(key);
        observables.push(dlSoundObservable);
        dlSoundObservable.subscribe(response => {
          const arrayBuffer = <ArrayBuffer> new Uint8Array(response.Body.data).buffer;
          this.audioContext.decodeAudioData(arrayBuffer).then((audioBuffer: AudioBuffer) => {
            this.audioBuffers[key] = audioBuffer;
            // console.log(`Downloaded audiobuffer for key: ${key}`);
          });
        });
      } else {
        observables.push(of(this.audioBuffers[key]));
      }
    });
    return forkJoin(observables);
  }

  playSound(key: string) {
    if (!this.audioBuffers[key]) {
      console.error(`Sound '${key}' does not exist or has not yet been downloaded.`);
    } else {
        const buf = this.audioBuffers[key];
        const source = this.audioContext.createBufferSource();
        source.buffer = buf;
        source.connect(this.audioContext.destination);
        source.start(0);
    }
  }

}
