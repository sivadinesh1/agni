import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoLivePageRoutingModule } from './go-live-routing.module';

import { GoLivePage } from './go-live.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoLivePageRoutingModule
  ],
  declarations: [GoLivePage]
})
export class GoLivePageModule {}
