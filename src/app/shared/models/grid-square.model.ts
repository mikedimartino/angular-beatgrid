export class GridSquare {
  on: boolean;

  readonly row: number;
  readonly column: number;

  constructor(row: number, column: number, on = false) {
    this.row = row;
    this.column = column;
    this.on = on;
  }

  toggle() {
    this.on = !this.on;
  }
}
