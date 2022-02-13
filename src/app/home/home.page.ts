/* eslint-disable no-debugger */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  resolveForwardRef,
} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';

import { CommonApiService } from 'src/app/services/common-api.service';
import * as moment from 'moment';
import { Subscription, Observable, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { initialize } from '@ionic/core';
import { ConnectivityService } from '../services/connectivity.service';
import { FireStoreService } from '../services/firestore.service';
// serverTimestamp - firestore details

import { Device } from '@awesome-cordova-plugins/device/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  @ViewChild('myCheckbox') myCheckbox;

  lat: any;
  lng: any;

  sunrise: any;
  sunset: any;

  timetoSunset: string;
  timetoSunrise: string;

  reverseGeo: any;
  now: any;
  nowA: any;
  todayDate: any;
  locality: any;
  isDetected = false;

  everySecond: Observable<number> = timer(0, 1000);
  subscription: Subscription;

  hasSunrisedToday: any;
  hasSunsetToday: any;
  counterTimer: any;

  counterTimersHours: any;
  counterTimersMins: any;
  counterTimersSecs: any;
  getready: any;

  sunsetPrayer: any;
  sunrisePrayer: any;

  isDark =  false;



  nextsunrise: any;
  nextsunset: any;
  nextsunriseHHMM: any;
  nextsunriseSS: any;
  nextsunsetHHMM: any;
  nextsunsetSS: any;
  nextsunriseA: any;
  nextsunsetA: any;

  // options: NativeGeocoderOptions = {
  //   useLocale: true,
  //   maxResults: 5,
  // };

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  today: any;
  tomorrow: any;
  tomorrowll: any;

  sunriseHHMM: any;
  sunriseSS: any;
  sunsetHHMM: any;
  sunsetSS: any;

  sunriseA: any;
  sunsetA: any;

  //live: any;
  paramsSubscription: Subscription;

  // geolocation options
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address: string;

  ideas: Observable<any>;
  phoneId: any;

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private commonApiService: CommonApiService,
    private cdr: ChangeDetectorRef,
    private router: Router, public alertController: AlertController,
    private route: ActivatedRoute,
    private connectivity: ConnectivityService,
    private fireStoreService: FireStoreService,private device: Device
  ) {

    this.platform.ready().then(() => {
      console.log('Platform ready');
      console.log('Device UUID is: ' + this.device.uuid);
      this.phoneId = this.device.uuid;
    });

        this.initializeAppMeta();

        this.route.params.subscribe((params) => {
            // combinations:
          // Today : Sunrise & Sunset (Not Over)
          // Today : Sunrise (Over) & Sunset(Not Over)
          // Today : Sunrise (Over) & Sunset (Over)
          // Today : Sunrise & Sunset (Over)
          // Today : Sunrise & Sunset (Not Over) : Sunrise (Live)
          // Today : Sunrise (Over) & Sunset (Not Over) : Sunset (Live)
          this.sunrisePrayer = '';
          this.sunsetPrayer = '';
          console.log(' inside home init params');

          this.getready = false;

          //  this.detectLocation();
          this.connectivity.appIsOnline$.subscribe(online => {
            if (online) {
              this.getCurrentCoordinates();
              this.fireStoreService.getIdeas().subscribe(data => {
                // console.log('ideaArrays', JSON.stringify(data));
              });

              this.cdr.markForCheck();
            }
          });

      });

    // comment in production
    // this.getSunriseSunset('', '', moment(new Date()).format('YYYY-MM-DD'));

  }


  initializeAppMeta() {
    this.todayDate = moment(new Date()).format('D MMM YYYY');
    this.now = moment(new Date()).format('h:mm');
    this.nowA = moment(new Date()).format('A');

    this.today = moment(new Date()).format('YYYY-MM-DD'); //2021-05-06 - format
    this.tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
    this.tomorrowll = moment(new Date()).add(1, 'days').format('ll');
  }

  ngOnInit() {
        // Current Time counter
        this.initializeClock();

        // device back button exit alert confirmation
        this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
          console.log('Back press handler!');
          this.showExitConfirm();

        });

  }

  initializeClock() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      this.now = moment().format('h:mm');
      this.nowA = moment().format('A');

      this.cdr.detectChanges();
    });

  }


  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // console.log(resp);
      // debugger;
      // console.log('latitude: ' + resp.coords.latitude);
      // console.log('longitude: ' + resp.coords.longitude);

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      // get address
      this.getAddress(resp.coords.latitude, resp.coords.longitude);

      // get sunrise & sunset
      this.getSunriseSunset(this.latitude, this.longitude, this.today);

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }



  // get address using coordinates
  getAddress(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.nativeGeocoderOptions)
    .then((result: NativeGeocoderResult[]) => {
      // prettify address
      //this.address = this.pretifyAddress(res[0]);
      this.locality = result[0].locality;
             this.isDetected = true;

             const row = {
               phoneId: this.phoneId,
                latitude,
                longitude,
                locality: result[0].locality,
                time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
             };
             this.fireStoreService.addIdea(row);
    })
    .catch((error: any) => {
      alert('Error getting address '+ JSON.stringify(error));
      this.presentAlert();
    });
  }

  // address
  pretifyAddress(address){
    const obj = [];
    let data = '';
    // eslint-disable-next-line guard-for-in
    for (const key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (const val in obj) {
      if(obj[val].length)
      {data += obj[val]+', ';}
    }
    return address.slice(0, -2);
  }




 // return sunrise & sunset time

  getSunriseSunset(latitude, longitude, when) {
    this.commonApiService
      .getSunriseSunsetAPI(latitude, longitude, when)
      .subscribe((data: any) => {


        // received sunrise & sunset time from API
        this.setSunriseSunsetFormats(data.results.sunrise, data.results.sunset);

        // *** find if SUNRISE (TODAY) is over or not *** //
        // *** If sunrise NOT OVER then sunset is also NOT OVER *** //
        if(this.isSunriseOver() && this.isSunsetOver()) {
          this.sunrisePrayer = 'over';
          this.sunsetPrayer = 'over';
          this.isDark = true;
          this.nextSunriseSunset('tomorrow');
          this.counterCalculator(data, 'waitingsunrise');
        } else if(this.isSunriseOver() && !this.isSunsetOver()) {

          this.sunsetPrayer = 'notover';
          this.isDark = false;
          this.nextSunriseSunset('today');
          this.counterCalculator(data, 'waitingsunset');
        } else if(!this.isSunriseOver()) {
          this.sunrisePrayer = 'notover';
          this.sunsetPrayer = 'notover';
          this.nextSunriseSunset('today');
          this.counterCalculator(data, 'waitingsunrise');
          this.isDark = false;
        }

        this.cdr.detectChanges();
      });
  }

  setSunriseSunsetFormats(sunrise, sunset) {
    this.sunrise = moment(sunrise ).format(
      'MMMM Do YYYY, h:mm:ss a'
    );

    this.sunset = moment(sunset).format(
      'MMMM Do YYYY, h:mm:ss a'
    );

    this.sunriseHHMM = moment(sunrise).format('h:mm');
    this.sunriseSS = moment(sunrise).format('ss');
    this.sunriseA = moment(sunrise).format('A');

    this.sunsetHHMM = moment(sunset).format('h:mm');
    this.sunsetSS = moment(sunset).format('ss');
    this.sunsetA = moment(sunset).format('A');

    this.timetoSunset = moment(sunset).fromNow();
    this.timetoSunrise = moment(sunrise).fromNow();

  }

  // check sunrise over or not
  isSunriseOver() {
    return (this.timetoSunrise.indexOf('ago') !== -1) ? true : false;
  }

  isSunsetOver() {
    return (this.timetoSunset.indexOf('ago') !== -1) ? true: false;
  }

  showExitConfirm() {
    this.alertController.create({
      header: 'Warning!',
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

  exitAgnihotra() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    navigator['app'].exitApp();
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../assets/bell.mp3';
    audio.load();
    audio.play();
  }

  counterCalculator(data, action) {
    let duration1: any;

    this.subscription = this.everySecond.subscribe((secondscounter) => {
      if (action === 'waitingsunset') {

        duration1 = moment.duration(moment().diff(moment(data.results.sunset)));
      } else if (action === 'waitingsunrise') {

        duration1 = moment.duration(
          moment(data.results.sunrise).diff(moment())
        );
      }

      // Hours / Minutes / Seconds
      this.counterTimersHours = Math.abs(duration1.hours());
      this.counterTimersMins = Math.abs(duration1.minutes());
      this.counterTimersSecs = Math.abs(duration1.seconds());

      if (this.counterTimersSecs < 11 && this.counterTimersMins === 0) {
        this.getready = true;
      } else {
        this.getready = false; // change it back to false check:
      }

      if (
        this.counterTimersHours === 0 &&
        this.counterTimersSecs === 0 &&
        this.counterTimersMins === 0
      ) {
        // this.live = true;
        if (action === 'waitingsunset') {
          this.goLive('evening');
        } else {
          this.goLive('morning');
        }

      }

      this.counterTimer = moment().format('h:mm:ss a');
      this.cdr.markForCheck();
    });
  }

  goLive(params) {
    this.playAudio();
    this.router.navigate([`go-live/${params}`]);
      // this.live = false;
      this.getready = false;
  }

  nextSunriseSunset(when) {
    this.commonApiService
      .getSunriseSunsetAPI(this.latitude, this.longitude, when)
      .subscribe((data: any) => {
        const tempSunrise = data.results.sunrise;
        const tempSunset = data.results.sunset;

        this.nextsunrise = moment(tempSunrise);
        this.nextsunset = moment(tempSunrise);
        this.nextsunriseHHMM = moment(tempSunrise).format('h:mm');
        this.nextsunriseSS = moment(tempSunrise).format('ss');

        this.nextsunriseA = moment(tempSunrise).format('A');
        this.nextsunsetHHMM = moment(tempSunset).format('h:mm');
        this.nextsunsetSS = moment(tempSunset).format('ss');

        this.nextsunsetA = moment(tempSunset).format('A');


        this.cdr.detectChanges();
      });
  }

  menu(param) {
    console.log(this.myCheckbox.nativeElement.checked, 'Value of checkbox');
    if (this.myCheckbox.nativeElement.checked) {
      this.myCheckbox.nativeElement.checked = false;
    }

    this.router.navigate([`/${param}`]);
  }


  signlist() {
    this.router.navigate([`/sign-list`]);
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Location Not Found',
      message: 'Unable to get GPS location. Enable your data, Wifi or Location Sharing',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    // eslint-disable-next-line @typescript-eslint/dot-notation
    navigator['app'].exitApp();
  }

}
