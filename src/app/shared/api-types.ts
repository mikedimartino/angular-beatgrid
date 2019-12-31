export namespace Api {
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    isSuccess: boolean;
    message: string;
    token: string;
    expiresIn: number;
    username: string;
  }
  
  export interface GetBeatsResponse {
    beats: Beat[];
    sounds: Sound[];
  }
  
  export interface Beat {
    id: string;
    name: string;
    tempo: number;
    timeSignature: TimeSignature;
    divisionLevel: number;
    rows: Row[];
    measures: Measure[];
  }

  export interface TimeSignature {
    notesPerMeasure: number;
    noteType: number;
  }

  export interface Row {
    index: number;
    soundId: string;
  }

  export interface Measure {
    activeSquares: Square[];
  }

  export interface Square {
    row: number;
    column: number;
  }

  export interface Sound {
    id: string;
    name: string;
    filePath: string;
  }
}