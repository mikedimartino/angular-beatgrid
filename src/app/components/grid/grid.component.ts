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
  squares: GridSquare[][];
  rows = 8;
  isPlaying = false;
  sounds: GridSound[];

  noteWidth: number;
  gridWidth: number;

  constructor(public beatService: BeatService,
              public playbackService: PlaybackService) {
  }

  ngOnInit() {
    this.generateGrid();
    this.generateDefaultBeat();
    this.sounds = this.playbackService.sounds;
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
    square.on = !square.on;
    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
  }

  onSoundClicked(sound: GridSound) {
    this.playbackService.playSound(sound.id);
  }

  onFooterClicked(column: number) {
    this.playbackService.setActiveColumn(column;)
  }

  onTempoChanged() {
    this.playbackService.updateColumnDuration();
  }

  private generateGrid() {
    this.squares = [];
    this.gridWidth = this.calculateGridWidth();

    for (let r = 0; r < this.rows; r++) {
      this.squares[r] = [];
      for (let c = 0; c < this.beatService.columns; c++) {
        this.squares[r][c] = new GridSquare(r, c);
      }
    }
  }

  private generateDefaultBeat() {
    for (let i = 0; i < this.beatService.columns; i ++) {
      // Hi-Hat
      if (i % 2 === 0) {
        this.onSquareClicked(this.squares[0][i]);
      }
      // Snare
      if ((i - 4) % 8 === 0) {
        this.onSquareClicked(this.squares[1][i]);
      }
      // Kick
      if (i % 8 === 0) {
        this.onSquareClicked(this.squares[2][i]);
      }
    }
  }

  private calculateGridWidth(): number {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
    return (this.noteWidth + (2 * noteMargin)) * this.beatService.columns;
  }

}
