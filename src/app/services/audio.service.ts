import { Injectable } from '@angular/core';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext = new AudioContext();
  audioBuffers: { [key: string]: AudioBuffer } = {};
  streamDestination = (<any>this.audioContext).createMediaStreamDestination();
  streamSource = this.audioContext.createMediaStreamSource(this.streamDestination.stream);

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode :
  // An AudioBufferSourceNode can only be played once;
  // after each call to start(), you have to create a new node if
  // you want to play the same sound again.

  playSound(soundKey: string, timeMs = 0) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffers[soundKey];
    source.connect(this.audioContext.destination);
    source.connect(this.streamDestination); // For recording
    source.start(timeMs / 1000);
  }

}
