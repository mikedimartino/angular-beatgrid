// https://blog.angular-university.io/angular-material-dialog/

import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {TimeSignature} from '../../shared/models/time-signature.model';

@Component({
  selector: 'app-edit-time-signature',
  templateUrl: './edit-time-signature.component.html',
  styleUrls: ['./edit-time-signature.component.scss']
})
export class EditTimeSignatureComponent {
  timeSignature: TimeSignature;

  constructor(
    private dialogRef: MatDialogRef<EditTimeSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.timeSignature = { ...data.timeSignature };
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.timeSignature);
  }

  onChangeNoteType(value: number) {
    this.timeSignature.noteType = value;
  }

}
