import { Tab1Page } from './home/tab1.page';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
// import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({
      rippleEffect: false,
    }),
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDOHFRN3sH3hWVqSH3usEs2qCNP9qXd0n8',
      libraries: ['places']
    }),
  ],
  providers: [
    Tab1Page,
    PhotoViewer,
    // ImagePicker,
    Geolocation,
    NativeGeocoder,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
