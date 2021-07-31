import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignDetailPageRoutingModule } from './sign-detail-routing.module';

import { SignDetailPage } from './sign-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignDetailPageRoutingModule
  ],
  declarations: [SignDetailPage]
})
export class SignDetailPageModule {}
