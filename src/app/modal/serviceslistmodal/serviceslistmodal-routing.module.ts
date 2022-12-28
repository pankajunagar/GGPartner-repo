import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceslistmodalPage } from './serviceslistmodal.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceslistmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceslistmodalPageRoutingModule {}
