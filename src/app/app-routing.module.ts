import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },

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
    path: 'go-live/:session',
    loadChildren: () => import('./go-live/go-live.module').then( m => m.GoLivePageModule)
  },
  {
    path: 'sign-list',
    loadChildren: () => import('./sign-list/sign-list.module').then( m => m.SignListPageModule)
  },
  {
    path: 'sign-detail',
    loadChildren: () => import('./sign-detail/sign-detail.module').then( m => m.SignDetailPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
