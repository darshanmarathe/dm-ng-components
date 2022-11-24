import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import {JSONFormComponent} from '../stories/JSONForm/JSONForm.component'

@NgModule({
  declarations: [
    AppComponent,
    JSONFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
