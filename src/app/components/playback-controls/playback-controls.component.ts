import { Component, OnInit } from '@angular/core';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';

@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent implements OnInit {

  constructor(public playbackService: PlaybackService,
              public beatService: BeatService) { }

  ngOnInit() {
  }

  togglePlayback() {
    if (!this.playbackService.isPlaying) {
      this.playbackService.startPlayback();
    } else {
      this.playbackService.stopPlayback();
    }
  }

  onAddMeasure() {
    this.beatService.addMeasure();
    this.playbackService.changeMeasure(this.beatService.measures.length - 1);
  }

  onDeleteMeasure() {
    const index = this.playbackService.currentMeasureIndex;
    const goToIndex = (index === this.beatService.measures.length - 1) ?
      Math.max(0, index - 1) : index;
    this.playbackService.changeMeasure(goToIndex);
    this.beatService.deleteMeasure(index);
  }

  onChangeMeasure(index: number) {
    this.playbackService.changeMeasure(index);
  }

  onPreviousMeasure() {
    this.playbackService.nextMeasure(true);
  }

  onNextMeasure() {
    this.playbackService.nextMeasure();
  }

}
