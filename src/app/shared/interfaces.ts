export interface BeatDbRow {
  id: string;
  name: string;
  json: string;
}

export interface S3Object {
  key: string;
  metadata?: any; // TODO: Create metadata interface
}

export interface Coordinate {
  x: number;
  y: number;
}
