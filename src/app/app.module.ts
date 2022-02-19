import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { HttpClientModule } from '@angular/common/http';
import { firebaseConfig } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Import Firebase modules + environment
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AngularFireModule } from '@angular/fire/compat';

import { Device } from '@awesome-cordova-plugins/device/ngx';

@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    
    IonicModule.forRoot({
      hardwareBackButton: true
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule

  ],
  exports: [],
  providers: [
    Geolocation,
    NativeGeocoder,Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
