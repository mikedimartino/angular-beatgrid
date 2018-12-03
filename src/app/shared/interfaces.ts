export interface BeatDbRow {
  id: number;
  name: string;
  json: string;
}

export interface S3Object {
  key: string;
  metadata?: any; // TODO: Create metadata interface
}
