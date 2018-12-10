import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { S3Object } from '../shared/interfaces';

@Injectable()
export class SoundService {
  s3Cache = {};
  audioBuffers: { [key: string]: AudioBuffer } = {};
  audioContext = new AudioContext();

  constructor(private apiService: ApiService) { }

  getSounds(folder: string = 'Drum Kits/'): Observable<any> {
    if (this.s3Cache[folder]) {
      return of(this.s3Cache[folder]);
    }

    return this.apiService.readSounds(folder).pipe(map((objects: S3Object[]) => {
      this.s3Cache[folder] = objects;
      this.downloadSounds(objects); // TODO: Make method return promise and do something?
      return objects;
    }));
  }

  // TODO: Make promises?
  downloadSounds(objects: S3Object[]) {
    objects.filter(obj => !obj.key.endsWith('/')).forEach(obj => {
      if (!this.audioBuffers[obj.key]) {
        this.apiService.downloadSound(obj.key).subscribe(response => {
          const arrayBuffer = <ArrayBuffer> new Uint8Array(response.Body.data).buffer;
          this.audioContext.decodeAudioData(arrayBuffer).then((audioBuffer: AudioBuffer) => {
            this.audioBuffers[obj.key] = audioBuffer;
            console.log('downloaded audiobuffer for key: ' + obj.key);
          });
        });
      }
    });
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
