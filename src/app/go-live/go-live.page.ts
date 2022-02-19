import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FireStoreService } from '../services/firestore.service';

@Component({
  selector: 'app-go-live',
  templateUrl: './go-live.page.html',
  styleUrls: ['./go-live.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoLivePage implements OnInit {

  whichPrayer: string;

  locality = '';
  session = '';
  phoneId = '';

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


constructor(private activatedroute: ActivatedRoute, private router: Router, private fireStoreService: FireStoreService,) {

  this.whichPrayer = this.activatedroute.snapshot.paramMap.get('session');
  this.session = this.activatedroute.snapshot.paramMap.get('session');
  this.phoneId = this.activatedroute.snapshot.paramMap.get('phoneId');
  this.locality = this.activatedroute.snapshot.paramMap.get('locality');


}

  ngOnInit() {
  }

  back() {
    const row = {
      phoneId: this.phoneId,
      session: this.session,
       locality: this.locality,
       time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };
    this.fireStoreService.addIdea(row);

    this.router.navigate([`/`]);
  }

}
