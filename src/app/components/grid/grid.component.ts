import { Component, OnInit } from '@angular/core';
import {GridSquare} from '../../shared/models/grid-square.model';
import {GridSound} from '../../shared/models/grid-sound.model';
import {PlaybackService} from '../../services/playback.service';
import {BeatService} from '../../services/beat.service';

const wholeNoteWidth = 32 * 16;
const noteMargin = 1;
const fps = 60;
const animationIntervalMs = 1000 / fps;

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
  interval: any;
  sounds: GridSound[];

  noteWidth: number;
  gridWidth: number;
  playbackCursorLeftMargin = 0;
  playbackCursorPxPerFrame: number;

  constructor(public beatService: BeatService,
              private playbackService: PlaybackService) {
  }

  ngOnInit() {
    this.generateGrid();
    this.playbackCursorPxPerFrame = this.calculateCursorPxPerFrame();
    this.sounds = this.playbackService.sounds;
  }

  isBeatColumn(column: number) {
    return column % (this.beatService.divisionLevel / this.beatService.timeSignature.noteType) === 0;
  }

  getColumnFooter(column: number) {
    if (this.isBeatColumn(column)) {
      return column / (this.beatService.divisionLevel / this.beatService.timeSignature.noteType);
    }
    return  '&#9702';
  }

  togglePlayback() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.interval = setInterval(this.animationUpdate.bind(this), animationIntervalMs);
    } else {
      clearInterval(this.interval);
    }
  }

  onSquareClicked(square: GridSquare) {
    square.on = !square.on;
    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
  }

  onSoundClicked(sound: GridSound) {
    this.playbackService.playSound(sound);
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

  private calculateGridWidth(): number {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
    return (this.noteWidth + (2 * noteMargin)) * this.beatService.columns;
  }

  // Assumes that the tempo is in BPM (beats per minute)
  private calculateSecondsPerMeasure(): number {
    return (60 * this.beatService.timeSignature.notesPerMeasure) / this.beatService.tempo;
  }

  // Number of pixels cursor should move per second
  private calculateCursorPxPerFrame(): number {
    const measuresPerSecond = 1 / this.calculateSecondsPerMeasure();
    const measuresPerFrame = measuresPerSecond / fps;
    return measuresPerFrame * this.gridWidth;
  }

  private animationUpdate() {
    this.playbackCursorLeftMargin = (this.playbackCursorLeftMargin + this.playbackCursorPxPerFrame) % (this.gridWidth - 15);
  }

}
