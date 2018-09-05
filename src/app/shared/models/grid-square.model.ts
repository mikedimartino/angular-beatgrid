export class GridSquare {
  private _on: boolean;
  get on() { return this._on; }

  readonly row: number;
  readonly column: number;

  constructor(row: number, column: number, on = false) {
    this.row = row;
    this.column = column;
    this._on = on;
  }

  toggle() {
    this._on = !this._on;
  }
}
