import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import {JSONForm} from '../stories/JSONForm/JSONForm.component'

@NgModule({
  declarations: [
    AppComponent,
    JSONForm
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
