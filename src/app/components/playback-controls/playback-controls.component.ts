import { Component } from '@angular/core';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {RecordOptions, RecordOptionsComponent} from '../record-options/record-options.component';
import { RecorderService } from '../../services/recorder.service';

@Component({
  selector: 'app-playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss']
})
export class PlaybackControlsComponent {

  constructor(public playbackService: PlaybackService,
              public beatService: BeatService,
              public recorderService: RecorderService,
              private dialog: MatDialog) {}

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

  onToggleRecord() {
    if (this.recorderService.isRecording) {
      this.recorderService.stop();
    } else {
      this.openRecordOptionsDialog();
    }
  }

  private openRecordOptionsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'no-padding';
    const dialogRef = this.dialog.open(RecordOptionsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((recordOptions: RecordOptions) => {
      if (recordOptions && recordOptions.name.length && recordOptions.playCount > 0) {
        this.recorderService.start(recordOptions);
      }
    });
  }

}
