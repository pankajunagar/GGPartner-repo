import { Tab1PageModule } from './home/tab1.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/tab1.module').then(m => m.Tab1PageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'otp-screen',
    loadChildren: () => import('./pages/otp-screen/otp-screen.module').then(m => m.OtpScreenPageModule)
  },
  {
    path: 'notificationModal',
    loadChildren: () => import('./modal/notification/notification.module').then(m => m.NotificationPageModule)
  },
  {
    path: 'invoiceModal',
    loadChildren: () => import('./modal/invoice/invoice.module').then(m => m.InvoicePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'serviceslistmodal',
    loadChildren: () => import('./modal/serviceslistmodal/serviceslistmodal.module').then(m => m.ServiceslistmodalPageModule)
  },

  // {
  //   path: '',
  //   redirectTo: '/tabs/home',
  //   pathMatch: 'full'
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
