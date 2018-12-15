import {Component, Inject, OnInit} from '@angular/core';
import { SoundService } from '../../services/sound.service';
import { S3Object } from '../../shared/interfaces';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GridSound} from '../../shared/models/grid-sound.model';
import {BeatService} from '../../services/beat.service';

const SOUND_LIBRARY_ROOT = 'Drum Kits/';

@Component({
  selector: 'app-sound-browser',
  templateUrl: './sound-browser.component.html',
  styleUrls: ['./sound-browser.component.scss']
})
export class SoundBrowserComponent implements OnInit {
  files = [];
  loading = false;
  breadcrumbs: string[] = [];
  openToKey = SOUND_LIBRARY_ROOT;
  rowIndex = 0;
  viewingSoundDetails = false;

  constructor(@Inject(MAT_DIALOG_DATA) data,
              private dialogRef: MatDialogRef<SoundBrowserComponent>,
              private beatService: BeatService,
              private soundService: SoundService) {
    if (data) {
      this.openToKey = data.soundKey;
      this.rowIndex = data.rowIndex;
    }
  }

  ngOnInit() {
    this.getSounds(this.openToKey);
  }

  onObjectClicked(file: S3Object) {
    this.getSounds(file.key);
  }

  isFolder(file: S3Object): boolean {
    return file.key.endsWith('/');
  }

  onBackClicked() {
    this.breadcrumbs.pop();
    this.navigateFromBreadcrumbs();
  }

  onBreadcrumbClicked(index: number) {
    if (index === this.breadcrumbs.length - 1) {
      return;
    }
    this.breadcrumbs.splice(index + 1);
    this.navigateFromBreadcrumbs();
  }

  playSound(file: S3Object) {
    this.soundService.playSound(file.key);
  }

  // TODO: Improve this / clean up
  selectSound() {
    this.beatService.changeSound(this.rowIndex, this.files[0].key);
    this.dialogRef.close();
  }

  private getSounds(folder: string = '') {
    this.updateBreadcrumbs(folder);
    this.loading = true;
    this.soundService.getSoundsByFolder(folder).subscribe(response => {
      this.loading = false;
      this.files = response;
      this.viewingSoundDetails = this.files.length === 1 && !this.isFolder(this.files[0]);
    });
  }

  private updateBreadcrumbs(path: string) {
    this.breadcrumbs = path.split('/').filter(s => s.length > 0);
  }

  private navigateFromBreadcrumbs() {
    const path = this.breadcrumbs.length ? this.breadcrumbs.join('/') + '/' : '';
    this.getSounds(path);
  }
}
