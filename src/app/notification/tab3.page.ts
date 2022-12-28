import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  data: any[] = [];
  constructor(
    private navCtrl: NavController,
    private util: UtilService,
    private api: ApiService,
    private cart: CartService
  ) { }

  ngOnInit() {
    this.util.startLoad();
    this.api.getDataWithToken('notification').subscribe((res: any) => {
      console.log("NOTIFICATION IN TAB", res)
      // debugger
      if (res.success === true) {
        this.data = res.data.reverse();
        this.util.dismissLoader();
        console.log(this.data);

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
    this.api.getDataWithToken('notification').subscribe((res: any) => {
      console.log("NOTIFICATION IN TAB", res);
      if (res.success === true) {
        this.data = res.data.reverse();
        this.util.dismissLoader();
        console.log(this.data);
        event.target.complete();
      } else {
        event.target.complete();
        this.util.dismissLoader();
        this.util.presentToast('data not found')
      }

    }, (err) => {
      event.target.complete();
      this.util.dismissLoader();
      this.util.presentToast('server error')
    })
  }
}
