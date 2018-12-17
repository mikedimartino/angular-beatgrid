import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BeatService} from '../../services/beat.service';
import {PlaybackService} from '../../services/playback.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoginComponent} from '../login/login.component';
import {EditTimeSignatureComponent} from '../edit-time-signature/edit-time-signature.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService,
              public beatService: BeatService,
              public playbackService: PlaybackService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  onLoginClicked() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'no-padding';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  openTsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      timeSignature: this.beatService.timeSignature
    };
    const dialogRef = this.dialog.open(EditTimeSignatureComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(timeSignature => {
      if (timeSignature) {
        this.beatService.setTimeSignature(timeSignature);
      }
    });
  }

  onChangeDivisionLevel(value: number) {
    this.beatService.setDivisionLevel(value);
  }

  onTempoChanged(value: number) {
    this.beatService.setTempo(value);
    this.playbackService.updateColumnDuration();
  }

}
