import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonApiService } from '../services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-detail',
  templateUrl: './sign-detail.page.html',
  styleUrls: ['./sign-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignDetailPage implements OnInit {
  sign: any;
  currentdate: any;
  description: any;
  luckyColor: any;
      luckyNumber: any;
      luckyTime: any;

      isloading= false;

  constructor(private router: Router, 
    private cdr: ChangeDetectorRef,
    private activatedroute: ActivatedRoute, private commonApiService: CommonApiService,) {
      this.isloading = false;
    this.sign = this.activatedroute.snapshot.paramMap.get('sign');
  }

  ngOnInit() {
    this.isloading = true;
    this.commonApiService
    .getAstroResults({}, this.sign.toLowerCase(), 'today')
    .subscribe((data: any) => {
      console.log('dinesh ' + JSON.stringify(data));
      this.isloading = false;
      this.currentdate = data.body.current_date;
      this.description = data.body.description;
      this.luckyColor = data.body.color;
      this.luckyNumber = data.body.lucky_number;
      this.luckyTime = data.body.lucky_time;

      this.cdr.markForCheck();
    });
  }

  back() {
    this.router.navigate([`/`]);
  }

}

