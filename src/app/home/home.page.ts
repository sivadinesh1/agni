/* eslint-disable no-debugger */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
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

  sunriseCopyTxt =
    'Sooryaya swaha sooryaya idam na mama Prajapataye swaha Prajapataye idam na mama';
  sunsetCopyTxt =
    'Agnaye Swahaagnaye idam na mama Prajapataye Swaha Prajapataye idam na mama';

  nextsunrise: any;
  nextsunset: any;
  nextsunriseHHMM: any;
  nextsunriseSS: any;
  nextsunsetHHMM: any;
  nextsunsetSS: any;
  nextsunriseA: any;
  nextsunsetA: any;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
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

  live: any;
  paramsSubscription: Subscription;

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private commonApiService: CommonApiService,
    private cdr: ChangeDetectorRef,
    private router: Router, public alertController: AlertController,
    private route: ActivatedRoute
  ) {
    this.basicInit();
    this.detectLocation();

    // this.paramsSubscription = this.route.params.subscribe((params) => {
    //   this.lat = params.lat;
    //   this.lng = params.lng;
    //   this.locality = params.locality;
    // });

    // inits




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
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
              this.locality = result[0].locality;

              this.todayDate = moment().format('D MMM YYYY');
              this.now = moment().format('h:mm');
              this.nowA = moment().format('A');

              this.today = moment().format('YYYY-MM-DD'); //2021-05-06 - format
              this.tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
              this.tomorrowll = moment().add(1, 'days').format('ll');

              console.log('xx....' + this.lat);
              console.log('xx....' + this.lng);
              console.log('xx....' + this.locality);

              this.getSunriseSunset(this.lat, this.lng, this.today);

              this.cdr.markForCheck();



    this.initializeApp();

            })
            .catch((error: any) => console.log(error));
        })
        .catch((error) => {
          console.log('Error getting location', error);
        });
    });
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


  basicInit() {
    // combinations:
    // Today : Sunrise & Sunset (Not Over)
    // Today : Sunrise (Over) & Sunset(Not Over)
    // Today : Sunrise (Over) & Sunset (Over)
    // Today : Sunrise & Sunset (Over)
    // Today : Sunrise & Sunset (Not Over) : Sunrise (Live)
    // Today : Sunrise (Over) & Sunset (Not Over) : Sunset (Live)
    this.sunrisePrayer = '';
    this.sunsetPrayer = '';

    this.live = false;
    this.getready = false;
  }

  ngOnInit() {
    // Current Time counter
    this.subscription = this.everySecond.subscribe((seconds) => {
      this.now = moment().format('h:mm');
      this.nowA = moment().format('A');

      this.cdr.detectChanges();
    });
    // Attn
    // this.getGeoDecoder(this.lat, this.lng);
    // console.log('dinesh lat >> ' + this.lat);
    // console.log('dinesh lng >> ' + this.lng);
    // console.log('dinesh locality >> ' + this.locality);

    // this.getSunriseSunset(this.lat, this.lng, this.today);
  }

  // get locality details based on lat & lng
  // getGeoDecoder(lat, lng) {
  //   this.nativeGeocoder
  //     .reverseGeocode(lat, lng, this.options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       this.locality = result[0].locality;

  //       this.cdr.detectChanges();
  //       // ATTN
  //       this.getSunriseSunset(lat, lng, this.today);
  //     })
  //     .catch((error: any) => console.log(error));
  //   // ATTN
  //   // this.getSunriseSunset(lat, lng, this.today);
  // }

  getSunriseSunset(lat, lng, when) {
    this.commonApiService
      .getSunriseSunsetAPI(lat, lng, when)
      .subscribe((data: any) => {
        console.log('dinesh getSunriseSunset ' + JSON.stringify(data));

        this.sunrise = data.results.sunrise;
        this.sunset = data.results.sunset;

        this.sunrise = moment(data.results.sunrise).format(
          'MMMM Do YYYY, h:mm:ss a'
        );

        this.sunset = moment(data.results.sunset).format(
          'MMMM Do YYYY, h:mm:ss a'
        );

        this.sunriseHHMM = moment(data.results.sunrise).format('h:mm');
        this.sunriseSS = moment(data.results.sunrise).format('ss');
        this.sunriseA = moment(data.results.sunrise).format('A');

        this.sunsetHHMM = moment(data.results.sunset).format('h:mm');
        this.sunsetSS = moment(data.results.sunset).format('ss');
        this.sunsetA = moment(data.results.sunset).format('A');

        this.timetoSunset = moment(data.results.sunset).fromNow();
        this.timetoSunrise = moment(data.results.sunrise).fromNow();

        const duration = moment.duration(
          moment().diff(moment(data.results.sunrise))
        );
        const hours = duration.hours(); //hours instead of asHours
        const minutes = duration.minutes(); //minutes instead of asMinutes
        const seconds = duration.seconds();

        // *** find if SUNRISE (TODAY) is over or not *** //
        // *** If sunrise NOT OVER then sunset is also NOT OVER *** //
        if (this.timetoSunrise.indexOf('ago') !== -1) {
          this.sunrisePrayer = 'over';

          // *** If SUNRISE OVER THEN CHECK SUNSET *** //
          if (this.timetoSunset.indexOf('ago') !== -1) {
            this.sunsetPrayer = 'over';
            this.tomorrowSunsetSunrise('tomorrow');
            this.counterCalculator(data, 'waitingsunrise');
          } else {
            this.sunsetPrayer = 'notover';
            this.tomorrowSunsetSunrise('today');
            this.counterCalculator(data, 'waitingsunset');
          }
        } else if (this.timetoSunrise.indexOf('in') !== -1) {
          this.sunrisePrayer = 'notover';
          this.sunsetPrayer = 'notover';
          this.tomorrowSunsetSunrise('today');
          this.counterCalculator(data, 'waitingsunrise');
        }

        this.cdr.detectChanges();
      });
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
        this.getready = false;
      }

      if (
        this.counterTimersHours === 0 &&
        this.counterTimersSecs === 0 &&
        this.counterTimersMins === 0
      ) {
        this.live = true;
        this.goLive();
      }

      this.counterTimer = moment().format('h:mm:ss a');
      this.cdr.markForCheck();
    });
  }

  goLive() {
    this.playAudio();
    setInterval(() => {
      this.live = false;
      this.getready = false;
    }, 180000); // 3 seconds
  }

  tomorrowSunsetSunrise(when) {
    this.commonApiService
      .getSunriseSunsetAPI(this.lat, this.lng, when)
      .subscribe((data: any) => {
        this.nextsunrise = moment(data.results.sunrise);
        this.nextsunset = moment(data.results.sunrise);
        this.nextsunriseHHMM = moment(data.results.sunrise).format('h:mm');
        this.nextsunriseSS = moment(data.results.sunrise).format('ss');

        this.nextsunriseA = moment(data.results.sunrise).format('A');
        this.nextsunsetHHMM = moment(data.results.sunset).format('h:mm');
        this.nextsunsetSS = moment(data.results.sunset).format('ss');

        this.nextsunsetA = moment(data.results.sunset).format('A');
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
}
