import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-serviceslistmodal',
  templateUrl: './serviceslistmodal.page.html',
  styleUrls: ['./serviceslistmodal.page.scss'],
})
export class ServiceslistmodalPage implements OnInit {
  servicesList: any = '';
  selectedList: any[] = [];
  constructor(
    public modalController: ModalController,
    private util: UtilService
  ) { }

  ngOnInit() {
  }

  modalClose() {
    console.log(this.servicesList);
    this.util.startLoad();
    let a = [];
    for (let i = 0; i < this.servicesList?.length; i++) {
      if (this.servicesList[i].isChecked === true) {
        a.push(this.servicesList[i].id);
      } else {
        continue;
      }
    }
    this.util.dismissLoader();
    // debugger
    this.modalController.dismiss({
      'dismissed': true,
      serviceList: a,
    });
  }

}
