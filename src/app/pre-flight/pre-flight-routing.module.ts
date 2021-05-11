import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreFlightPage } from './pre-flight.page';

const routes: Routes = [
  {
    path: '',
    component: PreFlightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreFlightPageRoutingModule {}
