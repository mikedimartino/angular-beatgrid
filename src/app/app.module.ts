import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { BeatService } from './services/beat.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { EditTimeSignatureComponent } from './components/edit-time-signature/edit-time-signature.component';
import { NoteTypeDropdownComponent } from './components/note-type-dropdown/note-type-dropdown.component';
import { ApiService } from './services/api.service';
import { PlaybackService } from './services/playback.service';
import { CrudToolbarComponent } from './components/crud-toolbar/crud-toolbar.component';
import { AwsService } from './services/aws.service';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    EditTimeSignatureComponent,
    NoteTypeDropdownComponent,
    CrudToolbarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [
    ApiService,
    AwsService,
    BeatService,
    PlaybackService
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditTimeSignatureComponent]
})
export class AppModule { }
