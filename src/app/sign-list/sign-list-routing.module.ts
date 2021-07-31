import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignListPage } from './sign-list.page';

const routes: Routes = [
  {
    path: '',
    component: SignListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignListPageRoutingModule {}
