import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tab1Page } from 'src/app/home/tab1.page';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  @Input() user_id: any;
  @Input() photo: any;
  @Input() name: any;
  @Input() service_type: any;
  @Input() time: any;
  @Input() location: any;
  @Input() latitude: any;
  @Input() longitude: any;
  @Input() duration: any;
  @Input() data: any;
  @Input() totalAmount: any;

  constructor(
    public modalController: ModalController,
    public home: Tab1Page,
    public cart: CartService,
    public api: ApiService,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  accept() {
    this.modalController.dismiss({
      'dismissed': true,
      from: 'accept',
      lat: this.latitude,
      lng: this.longitude
    });

  }

  close() {
    const param = {
      user_id: this.user_id,
      emp_status: 'Rejected',
      booking_id: this.data.booking_id
    }
    console.log(
      this.user_id,
      this.photo,
      this.name,
      this.service_type,
      this.time,
      this.location,
      this.latitude,
      this.longitude,
      this.duration,
      this.data,
    )
    this.api.postDataWithToken('empstatus', param).subscribe((res: any) => {
      console.log(res);
      this.util.presentToast(res.msg);
    })
    this.modalController.dismiss({
      dismissed: true,
      from: 'reject'
    });

  }

  ondismiss(item) {
    this.modalController.dismiss({
      'dismissed': true,
      lat: this.latitude,
      lng: this.longitude
    });
  }
}
