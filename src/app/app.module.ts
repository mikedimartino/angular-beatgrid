import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import {BeatService} from './services/beat.service';


@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [BeatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
