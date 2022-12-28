import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  data: any[] = [];
  constructor(
    private navCtrl: NavController,
    private util: UtilService,
    private api: ApiService,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.util.startLoad();
    this.api.getDataWithToken('empservices').subscribe((res: any) => {
      console.log("MY SERVICES IN TAB", res);
      if (res.success === true) {

        // res.data.forEach(element => {
        //   element.image === null ? null : 'data:image/jpeg;base64,' + element.image;
        // });
        this.data = res.data;
        this.util.dismissLoader();
        console.log(this.data)
      } else {
        this.util.dismissLoader();
        this.util.presentToast('data not found')
      }

    }, (err) => {
      this.util.dismissLoader();
      this.util.presentToast('server error')
    })
  }

  doRefresh(event) {
    this.util.startLoad();
    this.api.getDataWithToken('empservices').subscribe((res: any) => {
      console.log("MY SERVICES IN TAB", res);
      if (res.success === true) {
        // res.data.forEach(element => {
        //   element.image === null ? null : 'data:image/jpeg;base64,' + element.image;
        // });
        this.data = res.data;
        this.util.dismissLoader();
        console.log(this.data)
        event.target.complete();

      } else {
        this.util.dismissLoader();
        event.target.complete();
        this.util.presentToast('data not found')
      }

    }, (err) => {
      this.util.dismissLoader();
      event.target.complete();
      this.util.presentToast('server error')
    })
  }
}
