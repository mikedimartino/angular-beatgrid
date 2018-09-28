import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import {BeatService} from './services/beat.service';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { EditTimeSignatureComponent } from './components/edit-time-signature/edit-time-signature.component';
import { NoteTypeDropdownComponent } from './components/note-type-dropdown/note-type-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    EditTimeSignatureComponent,
    NoteTypeDropdownComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [BeatService],
  bootstrap: [AppComponent],
  entryComponents: [EditTimeSignatureComponent]
})
export class AppModule { }
