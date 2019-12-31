import { Injectable } from '@angular/core';
import { Beat } from '../shared/models/beat.model';
import { Api } from '../shared/api-types';
import { Measure } from '../shared/models/measure.model';
import { TimeSignature } from '../shared/models/time-signature.model';
import { GridSound } from '../shared/models/grid-sound.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  // TODO: ADD NULL CHECKS

  mapGridBeatToApiBeat(gridBeat: Beat): Api.Beat {
    return <Api.Beat> {
      id: gridBeat.id,
      name: gridBeat.name,
      tempo: gridBeat.tempo,
      timeSignature: {
        noteType: gridBeat.timeSignature.noteType,
        notesPerMeasure: gridBeat.timeSignature.notesPerMeasure
      },
      divisionLevel: gridBeat.divisionLevel,
      rows: gridBeat.measures[0].squares.map((row, index) =>
        <Api.Row> { index: index, soundId: gridBeat.sounds[index].key }
      ),
      measures: gridBeat.measures.map((measure, index) => {
        const apiMeasure = this.mapGridMeasureToApiMeasure(measure, gridBeat.timeSignature, gridBeat.divisionLevel);
        return apiMeasure;
      })
    };
  }

  private mapGridMeasureToApiMeasure(gridMeasure: Measure, timeSignature: TimeSignature, divisionLevel: number): Api.Measure { 
    // columnsPerNote = divisionLevel / timeSignature.noteType
    // apiSquare.column = gridSquare.column / columnsPerNote

    const activeSquares: Api.Square[] = [];
    const columnsPerNote = divisionLevel / timeSignature.noteType;

    gridMeasure.squares.forEach(row =>
      row.forEach(square => {
        if (square.on) {
          activeSquares.push(<Api.Square> {
            row: square.row,
            column: square.column / columnsPerNote
          });
        }
      })
    )

    return <Api.Measure> { activeSquares };
  }

  mapApiBeatToGridBeat(apiBeat: Api.Beat): Beat {
    const gridMeasures: Measure[] = [];
    const columnsPerMeasure = this.calculateColumnsPerMeasure(apiBeat.timeSignature, apiBeat.divisionLevel);
    const columnsPerNote = apiBeat.divisionLevel / apiBeat.timeSignature.noteType;

    apiBeat.measures.forEach(apiMeasure => {
      const gridMeasure =  new Measure(apiBeat.rows.length, columnsPerMeasure);
      apiMeasure.activeSquares.forEach(square => {
        const row = square.row;
        const translatedColumn = square.column * columnsPerNote;
        gridMeasure.squares[row][translatedColumn].on = true;
      });
      gridMeasures.push(gridMeasure);
    });

    return <Beat> {
      id: apiBeat.id,
      name: apiBeat.name,
      tempo: apiBeat.tempo,
      timeSignature: {
        notesPerMeasure: apiBeat.timeSignature.notesPerMeasure,
        noteType: apiBeat.timeSignature.noteType
      },
      divisionLevel: apiBeat.divisionLevel,
      sounds: apiBeat.rows.map(row => <GridSound> {
        key: row.soundId,
        name: row.soundId // TODO: Get actual name
      }),
      measures: gridMeasures
    };
  }

  // Copied from beat service
  private calculateColumnsPerMeasure(timeSignature: Api.TimeSignature, divisionLevel: number): number {
    return (timeSignature.notesPerMeasure / timeSignature.noteType) * divisionLevel;
  }
}
