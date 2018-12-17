import { Injectable } from '@angular/core';
import {PlaybackService} from './playback.service';
import {RecordOptions} from '../components/record-options/record-options.component';
import {Subscription} from 'rxjs/index';

// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamDestination

@Injectable()
export class RecorderService {
  mediaRecorder: MediaRecorder;
  isRecording = false;
  audioChunks = [];
  currentOptions: RecordOptions;
  stoppedPlaybackSubscription: Subscription;

  constructor(private playbackService: PlaybackService) {
    this.mediaRecorder = new MediaRecorder(this.playbackService.mediaDestNode.stream);
    this.mediaRecorder.ondataavailable = this.onMediaRecorderDataAvailable.bind(this);
    this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this);
  }

  startRecording(options: RecordOptions) {
    if (this.isRecording) {
      return;
    }
    this.isRecording = true;
    this.audioChunks = [];
    this.mediaRecorder.start();

    this.currentOptions = options;
    this.playbackService.playBeat(options.playCount);
    this.stoppedPlaybackSubscription = this.playbackService.stoppedPlaybackSubject.subscribe(() => {
      this.stopRecording();
    });
  }

  stopRecording() {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.mediaRecorder.stop();
    this.stoppedPlaybackSubscription.unsubscribe();
  }

  private onMediaRecorderDataAvailable(event: BlobEvent) {
    this.audioChunks.push(event.data);
  }

  private onMediaRecorderStop(event: Event) {
    const blob = new Blob(this.audioChunks, { 'type' : 'audio/wav' });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = this.currentOptions.name || name;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
