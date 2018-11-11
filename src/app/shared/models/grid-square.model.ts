export class GridSquare {
  on: boolean;
  row: number;
  column: number;

  constructor(row: number, column: number, on = false) {
    this.row = row;
    this.column = column;
    this.on = on;
  }

  toggle() {
    this.on = !this.on;
  }
}
