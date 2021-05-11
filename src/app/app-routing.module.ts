import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./home/home.module').then((m) => m.HomePageModule),
  // },
  { path: '', redirectTo: 'pre-flight', pathMatch: 'full' },
  {
    path: 'home/:lat/:lng/:locality',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },

  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./policy/policy.module').then((m) => m.PolicyPageModule),
  },
  {
    path: 'disclaimer',
    loadChildren: () =>
      import('./disclaimer/disclaimer.module').then(
        (m) => m.DisclaimerPageModule
      ),
  },
  {
    path: 'pre-flight',
    loadChildren: () =>
      import('./pre-flight/pre-flight.module').then(
        (m) => m.PreFlightPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
