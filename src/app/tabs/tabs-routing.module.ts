import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/tab1.module').then(m => m.Tab1PageModule),
        // children: [
        //   {
        //     path: 'notificationModal',
        //     loadChildren: () => import('../modal/notification/notification.module').then(m => m.NotificationPageModule)
        //   },
        //   {
        //     path: 'invoiceModal',
        //     loadChildren: () => import('../modal/invoice/invoice.module').then(m => m.InvoicePageModule)
        //   },
        // ]
      },
      {
        path: 'my-services',
        loadChildren: () => import('../my-services/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
