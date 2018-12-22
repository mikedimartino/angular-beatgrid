import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule, MatIconModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatSliderModule,
  MatTooltipModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { EditTimeSignatureComponent } from './components/edit-time-signature/edit-time-signature.component';
import { NoteTypeDropdownComponent } from './components/note-type-dropdown/note-type-dropdown.component';
import { LoginComponent } from './components/login/login.component';
import { SoundBrowserComponent } from './components/sound-browser/sound-browser.component';
import { GridComponent } from './components/grid/grid.component';
import { SelectionRectangleComponent } from './components/selection-rectangle/selection-rectangle.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { BeatLibraryComponent } from './components/beat-library/beat-library.component';
import {RecorderService} from './services/recorder.service';

import 'hammerjs';
import { RecordOptionsComponent } from './components/record-options/record-options.component';

@NgModule({
  declarations: [
    AppComponent,
    EditTimeSignatureComponent,
    GridComponent,
    LoginComponent,
    NoteTypeDropdownComponent,
    SelectionRectangleComponent,
    SoundBrowserComponent,
    HeaderComponent,
    PlaybackControlsComponent,
    BeatLibraryComponent,
    RecordOptionsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditTimeSignatureComponent,
    LoginComponent,
    RecordOptionsComponent,
    SoundBrowserComponent
  ]
})
export class AppModule { }
