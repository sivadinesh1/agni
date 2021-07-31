import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-live',
  templateUrl: './go-live.page.html',
  styleUrls: ['./go-live.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoLivePage implements OnInit {

  whichPrayer: string;

  sunriseCopyTxt1 =
    'SOORYAAYA SWAAHAA,';
    sunriseCopyTxt2 =
    'SOORYAAYA IDAM NA MAMA';
    sunriseCopyTxt3 =
    'PRAJAAPATAYE SWAAHA,';
    sunriseCopyTxt4 =
    'PRAJAAPATAYE IDAM NA MAMA';

  sunsetCopyTxt1 =
    'AGNAYE SWAAHAA';

    sunsetCopyTxt2 =
    'AGNAYE IDAM NA MAMA';

    sunsetCopyTxt3 =
    'PRAJAAPATAYE SWAAHAA';

    sunsetCopyTxt4 =
    'PRAJAAPATAYE IDAM NA MAMA';


constructor(private activatedroute: ActivatedRoute, private router: Router, ) {

  this.whichPrayer = this.activatedroute.snapshot.paramMap.get('session');
  console.log('which prayer...' + this.whichPrayer);
}

  ngOnInit() {
  }

  back() {
    this.router.navigate([`/`]);
  }

}
