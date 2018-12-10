import {
  AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {BeatService} from '../../services/beat.service';
import {Subscription} from 'rxjs/index';
import {PlaybackService} from '../../services/playback.service';
import {SelectionRectangleState} from '../selection-rectangle/selection-rectangle.component';
import {GridSquare} from '../../shared/models/grid-square.model';

const sixteenthNoteWidth = 32;
const wholeNoteWidth = sixteenthNoteWidth * 16;
const longPressMs = 300;

enum MouseContext {
  Default,
  FillSquare,
  EraseSquare
}

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  styleUrls: ['./grid2.component.scss']
})
export class Grid2Component implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  beatChangedSubscription: Subscription;
  noteWidth: number;
  noteHeight = 32;
  selectionRectangleActive = false;
  mouseContextEnum = MouseContext;
  mouseContext = MouseContext.Default;
  squareLongPressTimeoutHandler: any;
  highlightedSquaresDict = {}; // key is "x:y"

  topLeftSquare: HTMLElement;
  topLeftSquareTop = 0;
  topLeftSquareLeft = 0;
  bottomRightSquare: HTMLElement;
  shouldUpdateCornerSquares = false;

  @ViewChild('gridWrapperDiv') gridWrapperDiv: ElementRef;
  @ViewChild('soundIconDiv') soundIconDiv: ElementRef;
  @ViewChild('rowOptionsDiv') rowOptionsDiv: ElementRef;
  @ViewChild('footerWrapperDiv') footerWrapperDiv: ElementRef;

  constructor(
    private beatService: BeatService,
    private renderer: Renderer2,
    public playbackService: PlaybackService) {}

  ngOnInit() {
    this.updateNoteWidth();
    this.beatChangedSubscription = this.beatService.getBeatChangedObservable()
      .subscribe(() => {
        this.updateStyles();
      });
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    if (this.shouldUpdateCornerSquares) {
      setTimeout(() => this.updateCornerSquares(), 0);
      // this.updateCornerSquares();
      this.shouldUpdateCornerSquares = false;
    }
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

  onFooterClicked(column: number) {
    this.playbackService.setActiveColumn(column);
  }

  onSquareMouseDown(square: GridSquare, event: MouseEvent) {
    if (event.button !== 0 || event.shiftKey) {
      return;
    }

    square.toggle();

    clearTimeout(this.squareLongPressTimeoutHandler);
    this.squareLongPressTimeoutHandler = setTimeout(() => {
      this.mouseContext = square.on ? MouseContext.FillSquare : MouseContext.EraseSquare;
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

  @HostListener('document:mouseup') onMouseUp() {
    clearTimeout(this.squareLongPressTimeoutHandler);
    this.mouseContext = MouseContext.Default;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.which === 1) {
      this.clearHighlightedSquares();
    }
  }

  onSelectionRectangleChanged(state: SelectionRectangleState) {
    if (state.active !== this.selectionRectangleActive) {
      this.selectionRectangleActive = state.active;
      if (!state.active) {
        this.highlightCoveredSquares(state);
      }
    }
  }

  getSquareHtmlId(row: number, column: number) {
    return `square${row}_${column}`;
  }

  isHighlighted(square: GridSquare) {
    return this.highlightedSquaresDict[`${square.column}:${square.row}`] === true;
  }

  private highlightCoveredSquares(state: SelectionRectangleState) {
    let rowsCovered = state.height / (this.noteHeight + 1); // + 1 for margin
    let columnsCovered = state.width / (this.noteWidth + 1); // + 1 for margin

    const topLeftX = (state.topLeft.x - this.topLeftSquareLeft) / (this.noteWidth + 1);
    const topLeftY = (state.topLeft.y - this.topLeftSquareTop) / (this.noteHeight + 1);

    let startX = topLeftX;
    if (topLeftX < 0) {
      columnsCovered += topLeftX;
      startX = 0;
    }
    let finishX = startX + columnsCovered;

    let startY = topLeftY;
    if (topLeftY < 0) {
      rowsCovered += topLeftY;
      startY = 0;
    }
    let finishY = startY + rowsCovered;

    startX = Math.floor(startX);
    startY = Math.floor(startY);
    finishX = Math.min(Math.floor(finishX), this.beatService.columnsPerMeasure - 1);
    finishY = Math.min(Math.floor(finishY), this.beatService.rows - 1);

    for (let i = startX; i <= finishX; i++) {
      for (let j = startY; j <= finishY; j++) {
        this.highlightedSquaresDict[`${i}:${j}`] = true;
      }
    }
  }

  private clearHighlightedSquares() {
    this.highlightedSquaresDict = {};
  }

  private updateStyles(): void {
    this.updateNoteWidth();

    const soundIconDivWidth = this.soundIconDiv.nativeElement.clientWidth;
    const rowOptionsDivWidth = this.rowOptionsDiv.nativeElement.clientWidth;
    const gridMarginLeft = rowOptionsDivWidth - soundIconDivWidth;
    this.renderer.setStyle(this.gridWrapperDiv.nativeElement, 'margin-left', `${gridMarginLeft}px`);

    this.renderer.setStyle(this.footerWrapperDiv.nativeElement, 'margin-left', `${soundIconDivWidth}px`);

    this.shouldUpdateCornerSquares = true;
  }

  private updateNoteWidth(): void {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
  }

  private updateCornerSquares(): void {
    const topLeftId = this.getSquareHtmlId(0, 0);
    this.topLeftSquare = document.getElementById(topLeftId);

    const bottomRightId = this.getSquareHtmlId(this.beatService.rows - 1, this.beatService.columnsPerMeasure - 1);
    this.bottomRightSquare = document.getElementById(bottomRightId);

    const tlPos = this.getAbsPos(this.topLeftSquare);
    this.topLeftSquareLeft = tlPos.x;
    this.topLeftSquareTop = tlPos.y;
  }

  private getAbsPos(element: any): any {
    let left = 0;
    let top = 0;
    if (element.offsetParent) {
      do {
        left += element.offsetLeft;
        top += element.offsetTop;
      } while (element = element.offsetParent);
    }
    return { x: left, y: top };
  }

}
