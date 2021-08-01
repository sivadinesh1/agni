import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-list',
  templateUrl: './sign-list.page.html',
  styleUrls: ['./sign-list.page.scss'],
})
export class SignListPage implements OnInit {

  // create array of strings
  // eslint-disable-next-line max-len
  list = ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'];

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  godetail(item) {
    this.router.navigate([`/sign-detail/${item}`]);
  }

  back() {
    this.router.navigate([`/`]);
  }



}
