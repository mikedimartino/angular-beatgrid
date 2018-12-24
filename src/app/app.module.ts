import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule, MatIconModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatSliderModule,
  MatTooltipModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EditTimeSignatureComponent } from './components/edit-time-signature/edit-time-signature.component';
import { NoteTypeDropdownComponent } from './components/note-type-dropdown/note-type-dropdown.component';
import { LoginComponent } from './components/login/login.component';
import { SoundBrowserComponent } from './components/sound-browser/sound-browser.component';
import { GridComponent } from './components/grid/grid.component';
import { SelectionRectangleComponent } from './components/selection-rectangle/selection-rectangle.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaybackControlsComponent } from './components/playback-controls/playback-controls.component';
import { BeatLibraryComponent } from './components/beat-library/beat-library.component';

import 'hammerjs';
import { RecordOptionsComponent } from './components/record-options/record-options.component';
import { BeatDetailsComponent } from './components/beat-details/beat-details.component';

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
    RecordOptionsComponent,
    BeatDetailsComponent
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
    MatTooltipModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditTimeSignatureComponent,
    LoginComponent,
    RecordOptionsComponent,
    BeatDetailsComponent,
    SoundBrowserComponent
  ]
})
export class AppModule { }
