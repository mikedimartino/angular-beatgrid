import { Component, OnInit } from '@angular/core';
import { SoundService } from '../../services/sound.service';
import { ApiService } from '../../services/api.service';
import { S3Object } from '../../shared/interfaces';

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

  constructor(private soundService: SoundService,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.getSounds(SOUND_LIBRARY_ROOT);
  }

  onObjectClicked(file: S3Object) {
    this.getSounds(file.key);
  }

  isFolder(file: S3Object) {
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

  private getSounds(folder: string = '') {
    this.updateBreadcrumbs(folder);
    this.loading = true;
    this.soundService.getSounds(folder).subscribe(response => {
      this.loading = false;
      this.files = response;
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
