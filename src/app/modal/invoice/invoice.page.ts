import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  // data: any;
  // photo: any;
  // name: any;
  // service_type: any;
  // time: any;
  // duration: any = '30 Mins';
  bookingId: any;
  totalAmount: any;
  user_id: any;
  photo: any;
  name: any;
  service_type: any;
  time: any;
  location: any;
  latitude: any;
  longitude: any;
  duration: any;
  data: any;
  constructor(
    public modalController: ModalController,
    public cart: CartService,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private platform: Platform,
    private _location: Location,


  ) { }

  ngOnInit() {
  }

  Confirm() {
    // this.home.getLocationByNotification(28.642652678549336, 77.1121632385254)
    this.cart.servivestart = true;
    this.modalController.dismiss({
      'dismissed': true,
      // lat: 28.642652678549336,
      // lng: 77.1121632385254
    });
    let x = 2;
    const param = {
      // user_id: this.user_id,
      booking_id: this.bookingId,
      emp_time: parseFloat(this.duration.split(' ')[0]),
      emp_status: 'COMPLETED',
      status: x
    }
    console.log(param);
    // debugger
    this.api.postDataWithToken('employeeservicecomplete', param).subscribe((res) => {
      console.log(res);
      // debugger
      this.navCtrl.navigateForward('/tabs/my-services')

    }, (err) => {
      console.log(err)
      this.util.presentToast('server error try again later')
    })
  }
}
