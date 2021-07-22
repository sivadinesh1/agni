import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-pre-flight',
  templateUrl: './pre-flight.page.html',
  styleUrls: ['./pre-flight.page.scss'],
})
export class PreFlightPage implements OnInit {
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    private _location: Location,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }



  initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });


    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      this.showExitConfirm();

    });

  }

  showExitConfirm() {
    this.alertController.create({
      header: 'App termination',
      message: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }


  ngOnInit() {
    this.detectLocation();
  }

  detectLocation() {
    this.platform.ready().then(() => {
      this.geolocation
        .getCurrentPosition({
          timeout: 20000,
          enableHighAccuracy: true,
        })
        .then((resp) => {
          this.nativeGeocoder
            .reverseGeocode(
              resp.coords.latitude,
              resp.coords.longitude,
              this.options
            )
            .then((result: NativeGeocoderResult[]) => {
              this.router.navigate([
                `home/${resp.coords.latitude}/${resp.coords.longitude}/${result[0].locality}`,
              ]);
            })
            .catch((error: any) => console.log(error));
        })
        .catch((error) => {
          console.log('Error getting location', error);
        });
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Error',
      message: 'Location Detection Failed. Try restarting the App! ',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
