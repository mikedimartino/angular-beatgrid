import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-type-dropdown',
  templateUrl: './note-type-dropdown.component.html',
  styleUrls: ['./note-type-dropdown.component.scss']
})
export class NoteTypeDropdownComponent implements OnInit {
  noteTypes = [
    { value: 2, viewValue: 'Half' },
    { value: 4, viewValue: 'Quarter' },
    { value: 8, viewValue: 'Eighth' },
    { value: 16, viewValue: '16th' },
    { value: 32, viewValue: '32nd' },
    { value: 64, viewValue: '64th' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
