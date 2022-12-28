import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceslistmodalPageRoutingModule } from './serviceslistmodal-routing.module';

import { ServiceslistmodalPage } from './serviceslistmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceslistmodalPageRoutingModule
  ],
  declarations: [ServiceslistmodalPage]
})
export class ServiceslistmodalPageModule {}
