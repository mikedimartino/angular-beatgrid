import {GridSquare} from './grid-square.model';

export class Measure {
  private _squares: GridSquare[][];
  get squares() {
    return this._squares;
  }

  get numColumns() {
    if (!this.squares || !this.squares.length) {
      return 0;
    }
    return this.squares[0].length;
  }

  constructor(rows: number, columns: number) {
    this._squares = [];
    for (let r = 0; r < rows; r++) {
      this._squares[r] = [];
      for (let c = 0; c < columns; c++) {
        this._squares[r][c] = new GridSquare(r, c);
      }
    }
  }

  // TODO: Maybe add check to see if any notes would be lost
  collapseColumns(newColumnCount: number) {
    if (newColumnCount > this.numColumns || this.numColumns % newColumnCount !== 0) {
      console.error(`Could not collapse columns. Invalid new column count of '${newColumnCount}'.`);
      return;
    }

    const factor = this.numColumns / newColumnCount;
    this._squares = this.squares.map(row => {
      const newRow = [];
      let columnIndex = 0;
      row.forEach(square => {
        if (square.column % factor === 0) {
          newRow.push(new GridSquare(square.row, columnIndex++, square.on));
        }
      });
      return newRow;
    });
  }

  expandColumns(newColumnCount: number) {
    if (newColumnCount < this.numColumns || newColumnCount % this.numColumns !== 0) {
      console.error(`Could not expand columns. Invalid new column count of '${newColumnCount}'.`);
      return;
    }

    const factor = newColumnCount / this.numColumns;
    this._squares = this.squares.map(row => {
      const newRow = [];
      let columnIndex = 0;
      row.forEach(square => {
        newRow.push(new GridSquare(square.row, columnIndex++, square.on));
        for (let i = 1; i < factor; i++) {
          newRow.push(new GridSquare(square.row, columnIndex++));
        }
      });
      return newRow;
    });
  }
}
