import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignListPageRoutingModule } from './sign-list-routing.module';

import { SignListPage } from './sign-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignListPageRoutingModule
  ],
  declarations: [SignListPage]
})
export class SignListPageModule {}
