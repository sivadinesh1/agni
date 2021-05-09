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

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab1Page implements OnInit {
  lat: any;
  lng: any;

  sunrise: any;
  sunset: any;

  timetoSunset: string;
  timetoSunrise: string;
  dtWhen: any;
  reverseGeo: any;
  now: any;
  nowA: any;
  todayDate: any;
  locality: any;
  currentTime: moment.Moment;
  everySecond: Observable<number> = timer(0, 1000);
  subscription: Subscription;

  hasSunrisedToday: any;
  hasSunsetToday: any;
  counterTimer: any;

  counterTimersMins: any;
  counterTimersSecs: any;
  getready: any;

  sunsetPrayer: any;
  sunrisePrayer: any;

  sunriseCopyTxt =
    'Sooryaya swaha sooryaya idam na mama Prajapataye swaha prajapataye idam na mama';
  sunsetCopyTxt =
    'agnaye swahaagnaye idam na mama prajapataye swaha prajapataye idam na mama';

  nextsunrise: any;
  nextsunset: any;

  locationdetected = false;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };

  today: any;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private commonApiService: CommonApiService,
    private cdr: ChangeDetectorRef
  ) {
    // inits
    this.sunsetPrayer = 'notover';
    this.sunrisePrayer = 'notover';
    this.locationdetected = false;

    this.todayDate = moment().format('D MMM YYYY');
    this.now = moment().format('h:mm:ss');
    this.nowA = moment().format('A');

    this.today = moment().format('YYYY-MM-DD'); //2021-05-06 - format
  }

  ngOnInit() {
    // Current Time counter
    this.subscription = this.everySecond.subscribe((seconds) => {
      this.currentTime = moment();

      this.cdr.detectChanges();
    });
  }

  ionViewWillEnter() {
    // call this method on init
    this.whereAmI();
  }

  whereAmI() {
    console.log('dinesh sss ');
    this.geolocation
      .getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      })
      .then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;

        console.log('dinesh latitude ' + resp.coords.latitude);
        console.log('dinesh longitude ' + resp.coords.longitude);
        this.cdr.detectChanges();

        this.getGeoDecoder(resp.coords.latitude, resp.coords.longitude);

        if (
          this.sunsetPrayer === 'over' &&
          this.sunrisePrayer === 'over' &&
          this.locationdetected
        ) {
          // Todays Sunrise & Sunset is over so populate tomorrows sunrise timings & set flags
          this.tomorrowSunsetSunrise();
        }
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });

    // const watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    // });

    // this.nativeGeocoder
    //   .forwardGeocode('Berlin', this.options)
    //   .then((result: NativeGeocoderResult[]) =>
    //     console.log(
    //       'The coordinates are latitude=' +
    //         result[0].latitude +
    //         ' and longitude=' +
    //         result[0].longitude
    //     )
    //   )
    //   .catch((error: any) => console.log(error));
  }

  // get locality details based on lat & lng
  getGeoDecoder(lat, lng) {
    this.nativeGeocoder
      .reverseGeocode(lat, lng, this.options)
      .then((result: NativeGeocoderResult[]) => {
        this.locality = result[0].locality;
        this.locationdetected = true;
        this.cdr.detectChanges();
        this.getSunriseSunset(lat, lng, this.today);
      })
      .catch((error: any) => console.log(error));
  }

  getSunriseSunset(lat, lng, when) {
    this.commonApiService
      .getSunriseSunsetAPI(lat, lng, when)
      .subscribe((data: any) => {
        console.log('dinesh ' + JSON.stringify(data));

        this.sunrise = data.results.sunrise;
        this.sunset = data.results.sunset;

        this.sunrise = moment(data.results.sunrise).format(
          'MMMM Do YYYY, h:mm:ss a'
        );

        this.sunset = moment(data.results.sunset).format(
          'MMMM Do YYYY, h:mm:ss a'
        );

        this.timetoSunset = moment(data.results.sunset).fromNow();
        this.timetoSunrise = moment(data.results.sunrise).fromNow();

        const duration = moment.duration(
          moment().diff(moment(data.results.sunrise))
        );
        const hours = duration.hours(); //hours instead of asHours
        const minutes = duration.minutes(); //minutes instead of asMinutes
        const seconds = duration.seconds();

        console.log('dinesh hrs: ' + hours);
        console.log('dinesh min : ' + minutes);
        console.log('dinesh SSs : ' + seconds);

        // hasSunrisedToday
        console.log('dinesh $$ ' + this.timetoSunrise);
        console.log('dinesh ** ' + this.timetoSunset);

        // find if sunrise is over or not
        if (this.timetoSunrise.indexOf('ago') > 0) {
          console.log('dinesh .. sunrise already over ');
          this.sunrisePrayer = 'over';
        } else if (this.timetoSunrise.indexOf('in') > 0) {
          console.log('dinesh .. sunrise not yet over ');
          this.sunrisePrayer = 'notover';
        }

        console.log('dinesh !! ' + this.timetoSunset.indexOf('in'));
        // find if sunset is over or not
        if (this.timetoSunset.indexOf('ago') !== -1) {
          console.log('dinesh .. timetoSunset already over ');
          this.sunsetPrayer = 'over';
        } else if (this.timetoSunset.indexOf('in') !== -1) {
          console.log('dinesh .. timetoSunset not yet over ');
          this.sunsetPrayer = 'notover';
          this.subscription = this.everySecond.subscribe((secondscounter) => {
            const duration1 = moment.duration(
              moment().diff(moment(data.results.sunset))
            );

            //const hours = duration1.hours(); //hours instead of asHours
            this.counterTimersMins = duration1.minutes(); //minutes instead of asMinutes
            this.counterTimersSecs = duration1.seconds();

            if (this.counterTimersSecs < 11 && this.counterTimersMins === 0) {
              this.getready = true;
            } else {
              this.getready = false;
            }

            // let s = moment(data.results.sunset) - moment();

            this.counterTimer = moment().format('h:mm:ss a');
            this.cdr.markForCheck();
          });
        }
        this.cdr.detectChanges();
      });
  }

  tomorrowSunsetSunrise() {
    const tomorrow = moment().add(1, 'days').format('yyyy-mm-dd');

    this.commonApiService
      .getSunriseSunsetAPI(this.lat, this.lng, tomorrow)
      .subscribe((data: any) => {
        console.log('dinesh ' + JSON.stringify(data));

        this.nextsunrise = data.results.sunrise;
        this.nextsunset = data.results.sunset;
      });
  }
}

// https://api.sunrise-sunset.org/json?lat=13.067&lng=80.199&date=today

// var duration = moment.duration(end.diff(startTime));
// var hours = duration.hours(); //hours instead of asHours
// var minutes = duration.minutes(); //minutes instead of asMinutes

// Line 5812 - Msg: dinesh
// {"results":{"sunrise":"2021-05-06T00:28:14+00:00","sunset":"2021-05-06T13:03:07+00:00","solar_noon":"2021-05-06T06:45:41+00:00",
// "day_length":45293,"civil_twilight_begin":"2021-05-06T00:06:09+00:00",
// "civil_twilight_end":"2021-05-06T13:25:12+00:00","nautical_twilight_begin":"2021-05-05T23:40:14+00:00",
// "nautical_twilight_end":"2021-05-06T13:51:08+00:00","astronomical_twilight_begin":"2021-05-05T23:14:01+00:00",
// "astronomical_twilight_end":"2021-05-06T14:17:21+00:00"},"status":"OK"}
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5823 - Msg: dinesh hrs: 9
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5824 - Msg: dinesh min : 58
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5825 - Msg: dinesh SSs : 49
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5799 -
// Msg: {"latitude":11.317423,"longitude":77.72545869999999,
// "countryCode":"IN","countryName":"India",
// "postalCode":"638002","administrativeArea":"Tamil Nadu","subAdministrativeArea":"Erode",
// "locality":"Erode","subLocality":"Moolapalayam","thoroughfare":"6th Street",
// "subThoroughfare":"","areasOfInterest":["LIC Building"]}
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5781 - Msg: dinesh latitude 11.3174269
// I/Capacitor/Console: File: http://localhost/tab1-tab1-module.js - Line 5782 - Msg: dinesh longitude 77.7257728
