import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

export interface RecordOptions {
  name: string;
  playCount: number;
}

@Component({
  selector: 'app-record-options',
  templateUrl: './record-options.component.html',
  styleUrls: ['./record-options.component.scss']
})
export class RecordOptionsComponent {
  recordOptions: RecordOptions = {
    name: 'Fresh Beat',
    playCount: 1
  };
  errorMessage = '';

  constructor(private dialogRef: MatDialogRef<RecordOptionsComponent>) {}

  onSave() {
    this.dialogRef.close(this.recordOptions);
  }
}
