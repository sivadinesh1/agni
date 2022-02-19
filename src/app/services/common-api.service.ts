import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  constructor(private httpClient: HttpClient) {}

  getSunriseSunsetAPI(latitude, longitude, dtWhen) {
    console.log('longitude' + longitude);
    console.log('latitude' + latitude);
    console.log('when:' + dtWhen);

    return this.httpClient.get(
     `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dtWhen}&formatted=0`
    );
    // return this.httpClient.get(
    //   `https://api.sunrise-sunset.org/json?lat=25.2653471&lng=-55.2924914&date=today`
    // );
  }


  getAstroResults(submitForm, sign, day) {
		return this.httpClient.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, submitForm, { observe: 'response' });
	}

}


// xx....12.9021847
// /home-home-module.js:201 xx....77.6641523
// /home-home-module.js:202 xx....Haralur

  // "sunrise":"2021-08-01T00:33:56+00:00",
  // "sunset":"2021-08-01T13:17:26+00:00",

  // "sunrise":"2021-08-01T00:33:56+00:00",
  // "sunset":"2021-08-01T13:17:26+00:00"
