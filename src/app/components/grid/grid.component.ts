import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridSquare} from '../../shared/models/grid-square.model';
import {GridSound} from '../../shared/models/grid-sound.model';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';
import {Subscription} from 'rxjs/index';

const wholeNoteWidth = 32 * 16;
const noteMargin = 1;

export interface DivisionLevel {
  value: number;
  viewValue: string;
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
  isPlaying = false;
  noteWidth: number;
  gridWidth: number;
  divisionLevels: DivisionLevel[] = [
    { value: 2, viewValue: 'Half' },
    { value: 4, viewValue: 'Quarter' },
    { value: 8, viewValue: 'Eighth' },
    { value: 16, viewValue: '16th' },
    { value: 32, viewValue: '32nd' },
    { value: 64, viewValue: '64th' }
  ];
  beatChangedSubscription: Subscription;

  constructor(public beatService: BeatService,
              public playbackService: PlaybackService) {
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
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.playbackService.startPlayback();
    } else {
      this.playbackService.stopPlayback();
    }
  }

  onSquareClicked(square: GridSquare) {
    square.toggle();
    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
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

  onChangeMeasure(previous = false) {
    this.playbackService.changeMeasure(previous);
  }

  onChangeDivisionLevel(value: number) {
    this.beatService.setDivisionLevel(value);
  }

  private calculateWidths(): void {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
    this.gridWidth = (this.noteWidth + (2 * noteMargin)) * this.beatService.columnsPerMeasure;
  }

}
