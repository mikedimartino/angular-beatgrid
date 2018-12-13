import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {BeatService} from '../../services/beat.service';
import {Subscription} from 'rxjs/index';
import {PlaybackService} from '../../services/playback.service';
import {SelectionRectangleState} from '../selection-rectangle/selection-rectangle.component';
import {GridSquare} from '../../shared/models/grid-square.model';
import {GridService} from '../../services/grid.service';

const sixteenthNoteWidth = 32;
const wholeNoteWidth = sixteenthNoteWidth * 16;

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

  topLeftSquare: HTMLElement;
  topLeftSquareTop = 0;
  topLeftSquareLeft = 0;
  shouldUpdateCornerSquares = false;

  @ViewChild('gridWrapperDiv') gridWrapperDiv: ElementRef;
  @ViewChild('soundIconDiv') soundIconDiv: ElementRef;
  @ViewChild('rowOptionsDiv') rowOptionsDiv: ElementRef;
  @ViewChild('footerWrapperDiv') footerWrapperDiv: ElementRef;
  @ViewChild('hlAreaMenuContainerDiv') hlAreaMenuContainerDiv: ElementRef;

  constructor(
    private beatService: BeatService,
    public gridService: GridService,
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

  isActiveColumn(column: number) {
    return column === this.playbackService.activeColumn
      && this.playbackService.currentMeasureIndex === this.gridService.currentMeasureIndex;
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

  onSquareClick(square: GridSquare, event: MouseEvent) {
    console.log('onSquareClick()', event);
    if (event.button !== 0) {
      return;
    }
    square.toggle();
    this.playbackService.setColumnSoundActive(square.column, square.row, square.on);
  }

  onSelectionRectangleChanged(state: SelectionRectangleState) {
    if (state.active !== this.selectionRectangleActive) {
      this.selectionRectangleActive = state.active;
      if (!state.active) {
        this.highlightCoveredSquares(state);
      }
    }
  }

  getSquareHtmlId(row: number, column: number): string {
    return `square${row}_${column}`;
  }

  shouldHideRowOptionsMenu(): boolean {
    return this.selectionRectangleActive || this.gridService.anySquaresHighlighted();
  }

  // Highlighted area section
  onCopyHighlightedArea() {
    console.log('Copy');
  }

  onCutHighlightedArea() {
    console.log('Cut');
  }

  onFillHighlightedArea() {
    this.gridService.fillHighlightedSquares();
  }

  onDeleteHighlightedArea() {
    this.gridService.deleteHighlightedSquares();
  }

  onCancelHighlightedArea() {
    this.gridService.clearHighlightedSquares();
  }

  private highlightCoveredSquares(state: SelectionRectangleState) {
    const scrollX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    const scrollY = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

    const topLeftX = (state.topLeft.x - this.topLeftSquareLeft + scrollX) / (this.noteWidth + 2);
    const topLeftY = (state.topLeft.y - this.topLeftSquareTop + scrollY) / (this.noteHeight + 2);

    let rowsCovered = state.height / (this.noteHeight + 2); // + 2 for margin (each square has margin 1)
    let columnsCovered = state.width / (this.noteWidth + 2); // + 2 for margin (each square has margin 1)

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

    this.gridService.setAreaHighlighted(startX, startY, finishX, finishY);
  }

  private updateStyles(): void {
    this.updateNoteWidth();

    const soundIconDivWidth = this.soundIconDiv.nativeElement.clientWidth;
    const rowOptionsDivWidth = this.rowOptionsDiv.nativeElement.clientWidth;
    const gridMarginLeft = rowOptionsDivWidth - soundIconDivWidth;
    this.renderer.setStyle(this.gridWrapperDiv.nativeElement, 'margin-left', `${gridMarginLeft}px`);

    this.renderer.setStyle(this.footerWrapperDiv.nativeElement, 'margin-left', `${soundIconDivWidth}px`);

    if (this.hlAreaMenuContainerDiv) {
      const hlAreaMenuContainerDivHeight = this.gridWrapperDiv.nativeElement.clientHeight - this.footerWrapperDiv.nativeElement.clientHeight;
      this.renderer.setStyle(this.hlAreaMenuContainerDiv.nativeElement, 'height', `${hlAreaMenuContainerDivHeight}px`);
      this.renderer.setStyle(this.hlAreaMenuContainerDiv.nativeElement, 'width', `${rowOptionsDivWidth}px`);
    }

    this.shouldUpdateCornerSquares = true;
  }

  private updateNoteWidth(): void {
    this.noteWidth = wholeNoteWidth / this.beatService.divisionLevel;
  }

  private updateCornerSquares(): void {
    const topLeftId = this.getSquareHtmlId(0, 0);
    this.topLeftSquare = document.getElementById(topLeftId);

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
