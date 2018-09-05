import {GridSquare} from './grid-square.model';

export class Measure {
  squares: GridSquare[][];

  constructor(rows: number, columns: number) {
    this.squares = [];
    for (let r = 0; r < rows; r++) {
      this.squares[r] = [];
      for (let c = 0; c < columns; c++) {
        this.squares[r][c] = new GridSquare(r, c);
      }
    }
  }
}
