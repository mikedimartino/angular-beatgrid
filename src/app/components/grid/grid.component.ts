import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {GridSquare} from '../../shared/models/grid-square.model';
import {GridSound} from '../../shared/models/grid-sound.model';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';
import {Subscription} from 'rxjs/index';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {EditTimeSignatureComponent} from '../edit-time-signature/edit-time-signature.component';

const wholeNoteWidth = 32 * 16;
const noteMargin = 1;
const longPressMs = 500;

enum MouseContext {
  Default,
  FillSquare,
  EraseSquare
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    PlaybackService
  ]
})
export class GridComponent implements OnInit, OnDestroy {
  noteWidth: number;
  gridWidth: number;
  beatChangedSubscription: Subscription;
  mouseContextEnum = MouseContext;
  mouseContext = MouseContext.Default;
  squareLongPressTimeoutHandler: any;

  constructor(public beatService: BeatService,
              public playbackService: PlaybackService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.calculateWidths();
    this.beatChangedSubscription = this.beatService.getBeatChangedObservable().subscribe(() => {
      this.calculateWidths();
    });
  }

  ngOnDestroy() {
    this.beatChangedSubscription.unsubscribe();
  }

  isBeatColumn(column: number) {
    return column % (this.beatService.divisionLevel / this.beatService.timeSignature.noteType) === 0;
  }

  getColumnFooter(column: number) {
    if (this.isBeatColumn(column)) {
      return column / (this.beatService.divisionLevel / this.beatService.timeSignature.noteType);
    }
    return '&#9679;';
  }

  togglePlayback() {
    if (!this.playbackService.isPlaying) {
      this.playbackService.startPlayback();
    } else {
      this.playbackService.stopPlayback();
    }
  }

  onSquareMouseDown(square: GridSquare, event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    square.toggle();

    clearTimeout(this.squareLongPressTimeoutHandler);
    this.squareLongPressTimeoutHandler = setTimeout(() => {
      console.log('long press');
      this.mouseContext = square.on ? MouseContext.FillSquare : MouseContext.EraseSquare;
      console.log('mouseContext! : ' + this.mouseContext);
    }, longPressMs);

    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
  }

  onSquareMouseEnter(square: GridSquare) {
    if (this.mouseContext === MouseContext.FillSquare) {
      square.on = true;
      this.playbackService.setColumnSoundActive(square.column, square.row, true);
    } else if (this.mouseContext === MouseContext.EraseSquare) {
      square.on = false;
      this.playbackService.setColumnSoundActive(square.column, square.row, false);
    }
  }

  onSquareMouseLeave(square: GridSquare) {
    clearTimeout(this.squareLongPressTimeoutHandler);
  }

  @HostListener('window:mouseup') onMouseUp() {
    clearTimeout(this.squareLongPressTimeoutHandler);
    this.mouseContext = MouseContext.Default;
  }

  onSoundClicked(sound: GridSound) {
    this.playbackService.playSound(sound.id);
  }

  onFooterClicked(column: number) {
    this.playbackService.setActiveColumn(column);
  }

  onTempoChanged(value: number) {
    this.beatService.setTempo(value);
    this.playbackService.updateColumnDuration();
  }

  onAddMeasure() {
    this.beatService.addMeasure();
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
  onChangeDivisionLevel(value: number) {
    this.beatService.setDivisionLevel(value);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      timeSignature: this.beatService.timeSignature
    };
    const dialogRef = this.dialog.open(EditTimeSignatureComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(timeSignature => {
      this.beatService.setTimeSignature(timeSignature);
    });
  }

  private calculateWidths(): void {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
    this.gridWidth = (this.noteWidth + (2 * noteMargin)) * this.beatService.columnsPerMeasure;
  }

}
