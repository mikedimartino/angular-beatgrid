import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-save-beat',
  templateUrl: './beat-details.component.html',
  styleUrls: ['./beat-details.component.scss']
})
export class BeatDetailsComponent implements OnInit {
  name: FormControl;

  constructor(private dialogRef: MatDialogRef<BeatDetailsComponent>) { }

  ngOnInit() {
    this.name = new FormControl();
    this.name.setValidators([Validators.minLength(1), Validators.maxLength(30)]);
  }

  onSave() {
    this.dialogRef.close(this.name.value);
  }
}
