import { Component, OnInit } from '@angular/core';
import {BeatService} from '../../services/beat.service';
import {SoundBrowserComponent} from '../sound-browser/sound-browser.component';
import {MatDialog, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-beat-library',
  templateUrl: './beat-library.component.html',
  styleUrls: ['./beat-library.component.scss']
})
export class BeatLibraryComponent implements OnInit {

  constructor(public beatService: BeatService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  onBeatClicked(id: number) {
    this.beatService.selectBeat(id);
  }

  onDeleteBeatClicked(id: number) {
    this.beatService.delete(id);
  }

  saveBeat() {
    this.beatService.save();
  }

  newBeat() {
    this.beatService.new();
  }

  openSoundLibrary() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'no-padding';
    this.dialog.open(SoundBrowserComponent, dialogConfig);
  }
}
