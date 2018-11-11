import { Component, OnInit } from '@angular/core';
import {BeatService} from '../../services/beat.service';

@Component({
  selector: 'app-crud-toolbar',
  templateUrl: './crud-toolbar.component.html',
  styleUrls: ['./crud-toolbar.component.scss']
})
export class CrudToolbarComponent implements OnInit {
  beats = [
    { name: 'Beat 1', id: 1},
    { name: 'Beat 2', id: 2},
    { name: 'Beat 3', id: 3},
    { name: 'Beat 4', id: 4},
    { name: 'Beat 5', id: 5},
  ];

  constructor(private beatService: BeatService) { }

  ngOnInit() {
  }

  onSave() {
    this.beatService.save();
  }

  onNew() {
    this.beatService.new();
  }

  onDelete() {
    this.beatService.delete();
  }
}
