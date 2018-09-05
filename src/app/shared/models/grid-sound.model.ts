export class GridSound {
  readonly id: number;
  readonly name: string;
  readonly filePath: string;

  constructor(id: number, name: string, filePath: string) {
    this.id = id;
    this.name = name;
    this.filePath = filePath;
  }
}
