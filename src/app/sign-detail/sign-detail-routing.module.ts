import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignDetailPage } from './sign-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SignDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignDetailPageRoutingModule {}
