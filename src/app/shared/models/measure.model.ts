import { GridSquare } from './grid-square.model';

export class Measure {
  squares: GridSquare[][];

  get numColumns() {
    if (!this.squares || !this.squares.length) {
      return 0;
    }
    return this.squares[0].length;
  }

  constructor(rows = 0, columns = 0) {
    this.squares = [];
    for (let r = 0; r < rows; r++) {
      this.squares[r] = [];
      for (let c = 0; c < columns; c++) {
        this.squares[r][c] = new GridSquare(r, c);
      }
    }
  }

  static fromSquares(squares: GridSquare[][]): Measure {
    const measure = new Measure();
    measure.squares = squares;
    return measure;
  }

  static toBitStringArray(measure: Measure): string[] {
    const bitStrings: string[] = [];
    measure.squares.forEach(row => {
      bitStrings.push(row.map(square => square.on ? '1' : '0').join(''));
    });
    return bitStrings;
  }

  static fromBitStringArray(bitStrings: string[]): Measure {
    const squares: GridSquare[][] = [];
    bitStrings.forEach((bitString, rowIndex) => {
      const row: GridSquare[] = [];
      bitString.split('').forEach((bit, colIndex) => {
        row.push(new GridSquare(rowIndex, colIndex, bit === '1'));
      });
      squares.push(row);
    });
    return Measure.fromSquares(squares);
  }

  // TODO: Maybe add check to see if any notes would be lost
  collapseColumns(newColumnCount: number) {
    if (newColumnCount > this.numColumns || this.numColumns % newColumnCount !== 0) {
      console.error(`Could not collapse columns. Invalid new column count of '${newColumnCount}'.`);
      return;
    }

    const factor = this.numColumns / newColumnCount;
    this.squares = this.squares.map(row => {
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
    this.squares = this.squares.map(row => {
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
