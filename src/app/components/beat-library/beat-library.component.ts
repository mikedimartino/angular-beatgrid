import { Component, OnInit } from '@angular/core';
import {BeatService} from '../../services/beat.service';
import {SoundBrowserComponent} from '../sound-browser/sound-browser.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-beat-library',
  templateUrl: './beat-library.component.html',
  styleUrls: ['./beat-library.component.scss']
})
export class BeatLibraryComponent implements OnInit {
  constructor(public authService: AuthService,
              public beatService: BeatService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  onBeatClicked(id: string) {
    this.beatService.selectBeat(id);
  }

  onDeleteBeatClicked(id: string) {
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
