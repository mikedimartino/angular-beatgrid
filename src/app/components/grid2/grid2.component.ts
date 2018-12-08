import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  styleUrls: ['./grid2.component.scss']
})
export class Grid2Component implements OnInit, AfterViewInit {
  rows = new Array(8);
  columns = new Array(12);

  @ViewChild('gridWrapperDiv') gridWrapperDiv: ElementRef;
  @ViewChild('soundIconDiv') soundIconDiv: ElementRef;
  @ViewChild('rowOptionsDiv') rowOptionsDiv: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.updateGridStyle();
  }

  // TODO: Call this whenever grid width changes
  updateGridStyle() {
    const soundIconDivWidth = this.soundIconDiv.nativeElement.clientWidth;
    const rowOptionsDivWidth = this.rowOptionsDiv.nativeElement.clientWidth;
    const gridMarginLeft = rowOptionsDivWidth - soundIconDivWidth;
    this.renderer.setStyle(this.gridWrapperDiv.nativeElement, 'margin-left', `${gridMarginLeft}px`);
  }

}
