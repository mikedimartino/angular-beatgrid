import { Component, OnInit } from '@angular/core';
import {GridSquare} from '../../shared/models/grid-square.model';
import {GridSound} from '../../shared/models/grid-sound.model';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';

const wholeNoteWidth = 32 * 16;
const noteMargin = 1;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    PlaybackService
  ]
})
export class GridComponent implements OnInit {
  isPlaying = false;
  noteWidth: number;
  gridWidth: number;

  constructor(public beatService: BeatService,
              public playbackService: PlaybackService) {
  }

  ngOnInit() {
    // this.generateGrid();
    // this.generateDefaultBeat();
    // this.sounds = this.playbackService.sounds;
    this.calculateWidths();
    // TODO: Subscribe to an event for when beat changes to re-calculate widths
  }

  isBeatColumn(column: number) {
    return column % (this.beatService.beat.divisionLevel / this.beatService.beat.timeSignature.noteType) === 0;
  }

  getColumnFooter(column: number) {
    if (this.isBeatColumn(column)) {
      return column / (this.beatService.beat.divisionLevel / this.beatService.beat.timeSignature.noteType);
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
    square.on = !square.on;
    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
  }

  onSoundClicked(sound: GridSound) {
    this.playbackService.playSound(sound.id);
  }

  onFooterClicked(column: number) {
    this.playbackService.setActiveColumn(column);
  }

  onTempoChanged() {
    this.playbackService.updateColumnDuration();
  }

  onChangeMeasure(previous = false) {
    this.playbackService.changeMeasure(previous);
  }

  private calculateWidths(): void {
    this.noteWidth = wholeNoteWidth / this.beatService.beat.divisionLevel;
    this.gridWidth = (this.noteWidth + (2 * noteMargin)) * this.beatService.beat.columnsPerMeasure;
  }

}
