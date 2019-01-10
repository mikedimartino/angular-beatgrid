import { GridSquare } from './grid-square.model';

export class Measure {
  squares: GridSquare[][];

  constructor(rows = 0, columns = 0) {
    this.squares = [];
    for (let r = 0; r < rows; r++) {
      this.squares[r] = [];
      for (let c = 0; c < columns; c++) {
        this.squares[r][c] = new GridSquare(r, c);
      }
    }
  }

  static getNumColumns(measure: Measure) {
    if (!measure.squares || !measure.squares.length) {
      return 0;
    }
    return measure.squares[0].length;
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
  static collapseColumns(measure: Measure, newColumnCount: number) {
    const numColumns = Measure.getNumColumns(measure);
    if (newColumnCount > numColumns || numColumns % newColumnCount !== 0) {
      console.error(`Could not collapse columns. Invalid new column count of '${newColumnCount}'.`);
      return;
    }

    const factor = numColumns / newColumnCount;
    measure.squares = measure.squares.map(row => {
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

  static expandColumns(measure: Measure, newColumnCount: number) {
    const numColumns = Measure.getNumColumns(measure);
    if (newColumnCount < numColumns || newColumnCount % numColumns !== 0) {
      console.error(`Could not expand columns. Invalid new column count of '${newColumnCount}'.`);
      return;
    }

    const factor = newColumnCount / numColumns;
    measure.squares = measure.squares.map(row => {
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

  static addRow(measure: Measure, row: number): void {
    const numColumns = Measure.getNumColumns(measure);
    const newRow: GridSquare[] = [];
    for (let column = 0; column < numColumns; column++) {
      newRow.push(new GridSquare(row, column));
    }
    measure.squares.splice(row, 0, newRow);

    // Update row for squares in all rows after added row
    for (let i = row + 1; i < measure.squares.length; i++) {
      measure.squares[i].forEach(square => square.row++);
    }
  }

  static deleteRow(measure: Measure, row: number): void {
    if (measure.squares.length > 1) {
      measure.squares.splice(row, 1);

      // Update row for squares in all rows after deleted row
      for (let i = row; i < measure.squares.length; i++) {
        measure.squares[i].forEach(square => {
          square.row--;
        });
      }
    }
  }

  static moveRow(measure: Measure, prevIndex: number, newIndex: number): void {
    const isMovingDown = prevIndex < newIndex;
    const lowIndex = Math.min(prevIndex, newIndex);
    const highIndex = Math.max(prevIndex, newIndex);
    const moveRow = measure.squares[prevIndex];

    for (let i = lowIndex; i <= highIndex; i++) {
      const shiftRow = measure.squares[i];
      shiftRow.forEach(square => {
        square.row += isMovingDown ? 1 : -1;
      });
    }
    moveRow.forEach(square => square.row = newIndex);

    measure.squares.splice(prevIndex, 1);
    measure.squares.splice(newIndex, 0, moveRow);
  }

}
