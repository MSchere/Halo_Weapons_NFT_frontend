import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './wallet.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModelViewerComponent } from './model-viewer.component';
import { FormsModule } from '@angular/forms';
import '@google/model-viewer';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ModelViewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
