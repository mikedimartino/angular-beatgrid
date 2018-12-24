import * as Recorder from '../../assets/js/recorder';

import { Injectable } from '@angular/core';
import { AudioService } from './audio.service';
import { RecordOptions } from '../components/record-options/record-options.component';
import { PlaybackService } from './playback.service';
import { Subscription } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class RecorderService {
  recorder: Recorder;
  isRecording: boolean;
  currentOptions: RecordOptions;
  stoppedPlaybackSubscription: Subscription;

  constructor(private audioService: AudioService,
              private playbackService: PlaybackService) {
    this.recorder = new Recorder(audioService.streamSource);
  }

  start(options: RecordOptions) {
    this.isRecording = true;
    this.currentOptions = options;
    this.playbackService.playBeat(options.playCount);
    this.recorder.record();
    this.stoppedPlaybackSubscription = this.playbackService.stoppedPlaybackSubject.subscribe(() => {
      this.stop();
    });
  }

  stop() {
    this.isRecording = false;
    this.recorder.stop();
    this.stoppedPlaybackSubscription.unsubscribe();

    // create WAV download link using audio data blob
    this.createDownloadLink();

    this.recorder.clear();
  }

  createDownloadLink() {
    this.recorder.exportWAV((blob: Blob) => {
      const file = new File([blob], this.currentOptions.name, { type : 'audio/wav' });
      const url = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.download = file.name;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

}
