import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreFlightPageRoutingModule } from './pre-flight-routing.module';

import { PreFlightPage } from './pre-flight.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreFlightPageRoutingModule
  ],
  declarations: [PreFlightPage]
})
export class PreFlightPageModule {}
