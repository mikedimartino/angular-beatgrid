import { Injectable } from '@angular/core';
import {BeatService} from './beat.service';
import {PlaybackService} from './playback.service';
import {GridSquare} from '../shared/models/grid-square.model';

function getSquareKey(x: number, y: number): string {
  return `${x}:${y}`;
}

@Injectable()
export class GridService {
  currentMeasureIndex = 0;
  highlightedSquares: GridSquare[] = [];
  highlightedSquaresDict = {}; // key is "x:y"

  constructor(private beatService: BeatService,
              private playbackService: PlaybackService) {}

  get currentMeasure() {
    if (!this.beatService.measures || !this.beatService.measures.length) {
      return null;
    }
    if (this.playbackService.isPlaying) {
      this.currentMeasureIndex = this.playbackService.currentMeasureIndex;
    }
    return this.beatService.measures[this.currentMeasureIndex];
  }

  clearHighlightedSquares(): void {
    this.highlightedSquaresDict = {};
    this.highlightedSquares = [];
  }

  setAreaHighlighted(startX: number, startY: number, finishX: number, finishY: number): void {
    for (let column = startX; column <= finishX; column++) {
      for (let row = startY; row <= finishY; row++) {
        this.highlightedSquaresDict[getSquareKey(row, column)] = true;
      }
    }
    this.highlightedSquares = this.getSquaresInArea(startX, startY, finishX, finishY);
  }

  isHighlighted(square: GridSquare): boolean {
    return this.highlightedSquaresDict[getSquareKey(square.row, square.column)] === true;
  }

  anySquaresHighlighted(): boolean {
    // return Object.keys(this.highlightedSquaresDict).length > 0;
    return this.highlightedSquares.length > 0;
  }

  deleteHighlightedSquares(): void {
    this.highlightedSquares.forEach(square => {
      square.on = false;
    });
  }

  fillHighlightedSquares(): void {
    this.highlightedSquares.forEach(square => {
      square.on = true;
    });
  }

  private getSquaresInArea(startX: number, startY: number, finishX: number, finishY: number): GridSquare[] {
    const squares = [];
    for (let column = startX; column <= finishX; column++) {
      for (let row = startY; row <= finishY; row++) {
        squares.push(this.currentMeasure.squares[row][column]);
      }
    }
    return squares;
  }
}
