import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-note-type-dropdown',
  templateUrl: './note-type-dropdown.component.html',
  styleUrls: ['./note-type-dropdown.component.scss']
})
export class NoteTypeDropdownComponent {
  @Input() selection: number;
  @Output() selectionChange = new EventEmitter<number>();

  noteTypes = [
    { value: 2, viewValue: 'Half' },
    { value: 4, viewValue: 'Quarter' },
    { value: 8, viewValue: 'Eighth' },
    { value: 16, viewValue: '16th' },
    { value: 32, viewValue: '32nd' },
    { value: 64, viewValue: '64th' }
  ];

  onChangeNoteType(value: number) {
    this.selectionChange.emit(value);
  }
}
