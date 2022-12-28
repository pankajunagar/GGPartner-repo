import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { AgmCoreModule } from "@agm/core";
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2jNCC5xZEp6YhfeT16hrzJT3FIWcFahE',
      libraries: ['places']
    }),
  ],
  // providers:[Tab1Page],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
