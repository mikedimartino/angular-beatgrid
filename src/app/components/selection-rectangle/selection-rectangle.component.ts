import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {Coordinate} from '../../shared/interfaces';

const LONG_PRESS_TIME_MS = 250;

export class SelectionRectangleState {
  active: boolean;
  topLeft: Coordinate;
  height: number;
  width: number;
  element: HTMLElement;

  constructor() {
    this.topLeft = <Coordinate> {};
  }

  different(otherState: SelectionRectangleState): boolean {
    return !otherState || otherState.active !== this.active
      || otherState.topLeft.x !== this.topLeft.x
      || otherState.topLeft.y !== this.topLeft.y
      || otherState.height !== this.height
      || otherState.width !== this.width;
  }

  assign(otherState: SelectionRectangleState): void {
    this.active = otherState.active;
    this.topLeft.x = otherState.topLeft.x;
    this.topLeft.y = otherState.topLeft.y;
    this.height = otherState.height;
    this.width = otherState.width;
    this.element = otherState.element;
  }
}

@Component({
  selector: 'app-selection-rectangle',
  templateUrl: './selection-rectangle.component.html',
  styleUrls: ['./selection-rectangle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionRectangleComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() containerId: string;
  @Output() stateChanged = new EventEmitter<SelectionRectangleState>();

  containerElement: HTMLElement;
  origin: Coordinate = { x: 0, y: 0 };
  offsetTop: number;
  offsetLeft: number;
  offsetWidth: number;
  scrollX = 0;
  scrollY = 0;
  isLongPressing = false;
  longPressTimerId: any;

  state: SelectionRectangleState = new SelectionRectangleState();
  lastState: SelectionRectangleState = new SelectionRectangleState();

  get displayTop() {
    return this.state.topLeft.y + this.scrollY;
  }

  get displayLeft() {
    return this.state.topLeft.x + this.scrollX;
  }

  get displayHeight() {
    return this.state.height;
  }

  get displayWidth() {
    return this.state.width;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.state.element = this.el.nativeElement;
    this.lastState.element = this.el.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['containerId']) {
      this.containerElement = document.getElementById(this.containerId);
      this.offsetTop = this.containerElement.offsetTop;
      this.offsetLeft = this.containerElement.offsetLeft;
      this.offsetWidth = this.containerElement.offsetWidth;
    }
  }

  ngAfterViewInit() {
    this.hide();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.containerElement || !this.state.active) {
      return;
    }
    if (this.isLongPressing) {
      this.scrollX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      this.scrollY = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      const x = event.clientX;
      const y = event.clientY;
      this.state.topLeft.x = Math.min(x, this.origin.x);
      this.state.topLeft.y = Math.min(y, this.origin.y);
      this.state.height = Math.abs(y - this.origin.y);
      this.state.width = Math.abs(x - this.origin.x);
      this.onStateChanged();
      this.cd.markForCheck();
    }
  }

  @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
    this.isLongPressing = false;
    clearTimeout(this.longPressTimerId);
    this.longPressTimerId = setTimeout(() => {
      this.isLongPressing = true;
      this.scrollX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      this.scrollY = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      this.origin = {
        x: event.clientX,
        y: event.clientY
      };
      this.state.height = 0;
      this.state.width = 0;
      this.state.topLeft.x = event.clientX;
      this.state.topLeft.y = event.clientY;
      this.show();
      this.cd.markForCheck();
    }, LONG_PRESS_TIME_MS);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    clearTimeout(this.longPressTimerId);
    this.isLongPressing = false;
    this.hide();
  }

  hide() {
    this.state.active = false;
    this.onStateChanged();
    this.renderer.setStyle(this.el.nativeElement, 'visibility', 'hidden');
  }

  show() {
    this.state.active = true;
    this.onStateChanged();
    this.renderer.setStyle(this.el.nativeElement, 'visibility', 'visible');
  }

  private onStateChanged() {
    if (this.state.different(this.lastState)) {
      this.lastState.assign(this.state);
      this.stateChanged.emit(this.state);
    }
  }

}
