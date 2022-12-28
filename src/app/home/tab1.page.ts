import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { InvoicePage } from './../modal/invoice/invoice.page';
import { TimeCounterComponent } from './../POPUP/time-counter/time-counter.component';
import { NotificationPage } from '../modal/notification/notification.page';
import { UtilService } from "../services/util.service";
import { ApiService } from "../services/api.service";
import { Component, OnInit, ViewChild, ElementRef, NgZone, DoCheck, OnChanges, Inject } from "@angular/core";
import { NavController, Platform, PopoverController } from "@ionic/angular";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { MapsAPILoader, AgmCoreModule } from '@agm/core';
import { CartService } from "src/app/services/cart.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ModalController, AlertController } from '@ionic/angular';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { modalController } from '@ionic/core';

import { LocalNotifications } from '@capacitor/local-notifications';

// import { param } from 'jquery';

// declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('search')
  public searchElementRef: ElementRef;
  // google maps zoom level
  userName: any;
  service_Name: any;
  userLocation: any;
  userPhoto: any = null;
  clock: any;
  starting_Time: any;
  ending_Time: any;
  duration: any;

  totalAmount: any;

  networkStatus: any = 'Go Offline';
  buttonEnable: boolean = true;
  address: string;
  zoom: number = 13;
  zoomControl: false
  data: any = [];
  err: any;
  // initial center position for the map
  lat: number = 28.6196;
  lng: number = 77.0550;
  serviceLocation: any = null;
  serviceStarted: boolean = false;//
  serviceAccepted: boolean = false;
  serviceCompleted: any = null;
  private geoCoder;

  notificationData: any;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    public nativeGeocoder: NativeGeocoder,
    private api: ApiService,
    private util: UtilService,
    public geolocation: Geolocation,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    // private cart: CartService,
    // private route: ActivatedRoute,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) {
    // let notification = null;
    // this.notificationModal(notification)
  }

  ngOnInit() {
    this.backButtonEvent();
    this.fetchlocation();
    this.getNotificationToken();
    this.getAvailibityStatus();
    this.platform.ready().then(() => {

      this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.CAMERA,
          // this.androidPermissions.PERMISSION.CALL_PHONE,
          // this.androidPermissions.PERMISSION.GET_ACCOUNTS,
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION,

        ]
      );

    })
    console.log('buttonEnable')
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(999, async () => {
      console.log('Back Button --------------->>>', this.router.url, 'ad',);
      if (this.modalController.getTop()) {
        const modal = await this.modalController.getTop();
        console.log(modal)
        // debugger
        if (modal) {
          console.log("you can't exit")
        }
        else {
          if (this.router.url === '/tabs/notification' || this.router.url === '/tabs/my-services' || this.router.url === '/tabs/profile') {
            this.navCtrl.back();
          } else if (this.router.url === '/tabs/home') {
            // debugger
            navigator['app'].exitApp();
          } else if (this.router.url === '/tabs/home?data=%5Bobject%20Object%5D&from=otpScreen') {
            // debugger
            navigator['app'].exitApp();
          } else {
            console.log("you can't exit");
          }
        }
      }

      // debugger
      // if (this.router.url === '/tabs/notification' || this.router.url === '/tabs/my-services' || this.router.url === '/tabs/profile') {
      //   debugger
      //   this.navCtrl.back();
      // } else if (this.router.url === 'tabs/home') {
      //   debugger
      //   navigator['app'].exitApp();
      //   // this.navCtrl.back();
      // } else {
      //   debugger
      //   console.log("you can't exit")
      // }
    });
  }

  getNotificationToken() {
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log(notification);
        this.notificationData = notification.data;
        this.notificationModal(notification);
      }
    );
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        console.log(notification);
        this.notificationData = notification.notification.data;
        this.notificationModal(notification.notification);
      }
    );
  }

  async notificationModal(notification) {
    // debugger
    this.totalAmount = notification.data.total;
    this.userName = JSON.parse(notification.data.user).name;
    this.userLocation = notification.data.location;
    const x = JSON.parse(notification.data.services);
    let service_name = [];
    for (let i = 0; i < x?.length; i++) {
      service_name.push(x[i].service.name);
    }
    this.service_Name = service_name;
    this.userPhoto = JSON.parse(notification.data.user).image === null ? null : JSON.parse(notification.data.user).imageUri;
    // debugger
    let user_id = notification.data.user_id;
    let photo = JSON.parse(notification.data.user).image === null ? null : JSON.parse(notification.data.user).imageUri;
    let name = JSON.parse(notification.data.user).name;
    let service_type = service_name;
    let time = notification.data.time;
    let location = notification.data.location;
    let latitude = notification.data.latitude;
    let longitude = notification.data.longitude;
    let duration = notification.data.duration;
    let data = notification.data;
    let totalAmount = notification.data.total;
    debugger
    const modal = await this.modalController.create({
      component: NotificationPage,
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      showBackdrop: false,
      componentProps: {
        user_id: notification.data.user_id,
        photo: JSON.parse(notification.data.user).image === null ? null : JSON.parse(notification.data.user).imageUri,
        name: JSON.parse(notification.data.user).name,
        service_type: service_name,
        time: notification.data.time,
        location: notification.data.location,
        latitude: notification.data.latitude,
        longitude: notification.data.longitude,
        duration: notification.data.duration,
        data: notification.data,
        totalAmount: notification.data.total

      }
    });

    modal.onDidDismiss().then((coupon) => {
      const user = coupon;
      if (user.data.from === 'accept') {
        this.serviceAccepted = true;
        this.lat = parseFloat(user.data.lat);
        this.lng = parseFloat(user.data.lng);
        // debugger
        this.getAddress(this.lat, this.lng);
      } else {
        this.serviceAccepted = false;
      }
      // debugger
      // this.cart.coords = {
      //   lat: 38.644800,
      //   lng: 78.391029
      // }
      // lat: 28.642652678549336, lng: 77.1121632385254


      // this.getLocationByNotification(lat, lng);
      // debugger
    });
    await modal.present();

  }

  fetchlocation() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,);
      autocomplete.addListener("place_changed", (res) => {
        console.log(res);
        // debugger
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 14;
          this.getAddress(place.geometry.location.lat(), place.geometry.location.lng());
        });
      });
    });
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // debugger
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 14;
        this.zoomControl = false
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  markerDragEnd($event) {
    // debugger
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  async getAddress(latitude, longitude) {
    // debugger
    this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 14;
          // this.cart.googleAddress = results[0].formatted_address;
          this.address = results[0].formatted_address;
          // debugger
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  // async getLocationByNotification(latitude, longitude) {
  //   this.lat = latitude;
  //   this.lng = longitude;
  //   this.geoCoder = new google.maps.Geocoder;
  //   await this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 14;
  //         // this.cart.googleAddress = results[0].formatted_address;
  //         this.address = results[0].formatted_address;
  //         // this.lat = parseFloat(latitude);
  //         // this.lng = parseFloat(longitude);
  //         debugger
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //     // const marker = new google.maps.Marker();

  //   });
  //   // })

  // }

  getAvailibityStatus() {
    const param = { id: localStorage.getItem('userID'), emp_status: 'ONLINE' }
    this.api.postDataWithToken('employeestatus', param).subscribe((res: any) => {
      // debugger
      if (res.success === true) {
        this.util.dismissLoader()
        this.networkStatus = 'Go Offline'
        // this.util.presentToast("You'll not receive notification.")
      } else {
        this.util.presentToast(res.msg)
      }
    }, (err) => {
      this.util.presentToast(err);
    })
  }

  changenetwork(status) {
    if (status === 'offline') {
      //api for go Offline
      this.util.startLoad();
      const param = { id: localStorage.getItem('userID'), emp_status: 'OFFLINE' }
      this.api.postDataWithToken('employeestatus', param).subscribe((res: any) => {
        // debugger
        if (res.success === true) {
          this.util.dismissLoader()
          this.networkStatus = 'Go Online'
          this.util.presentToast("You'll not receive notification.")
        } else {
          this.util.presentToast(res.msg)
        }
      }, (err) => {
        this.util.presentToast(err);
      })
      // this.util.presentToast('you"ll not receive any notfication')
    } else if (status === 'online') {
      //api for go online
      this.util.startLoad();
      const param = { id: localStorage.getItem('userID'), emp_status: 'ONLINE' }
      this.api.postDataWithToken('employeestatus', param).subscribe((res: any) => {
        // debugger
        if (res.success === true) {
          this.util.dismissLoader()
          this.networkStatus = 'Go Offline'
          this.util.presentToast("You'll receive notification.")
        } else {
          this.util.presentToast(res.msg)
        }
      }, (err) => {
        this.util.presentToast(err);
      })
      // this.util.presentToast('you"ll receive notfication')

    }
  }

  startService(events) {
    if (events === true) {
      this.serviceStarted = true;
      this.serviceAccepted = false;
      this.buttonEnable = false;
      var x = new Date()
      var ampm = x.getHours() >= 12 ? ' PM' : ' AM';
      let hours = x.getHours() % 12;
      hours = hours ? hours : 12;
      let Hours = hours.toString().length == 1 ? 0 + hours.toString() : hours;

      var minutes = x.getMinutes().toString()
      minutes = minutes.length == 1 ? 0 + minutes : minutes;
      debugger

      var seconds = x.getSeconds().toString()
      seconds = seconds.length == 1 ? 0 + seconds : seconds;


      this.starting_Time = Hours + ":" + minutes + ":" + seconds + ":" + ampm;

      this.display_c5();
    } else if (events === false) {
      this.serviceStarted = false;
      this.serviceAccepted = false;
      this.buttonEnable = false;

      let a = this.starting_Time.split(' ')[0].split(':')
      let num1 = Number(a[0]) * 60 + Number(a[1]);

      let b = this.clock.split(' ')[0].split(':');
      let num2 = Number(b[0]) * 60 + Number(b[1]);

      this.duration = num2 - num1 + ' Mins';

      console.log(this.starting_Time, this.clock, this.duration);
      this.invoiceModal();
      // debugger
    }
  }

  canelService(events) {
    if (events === true) {
      this.serviceStarted = false;
      this.serviceAccepted = false;
      this.buttonEnable = true;

    }
  }

  display_c5() {
    return setInterval(
      () => {
        var x = new Date()
        var ampm = x.getHours() >= 12 ? ' PM' : ' AM';
        let hours = x.getHours() % 12;
        hours = hours ? hours : 12;
        let Hours = hours.toString().length == 1 ? 0 + hours.toString() : hours;
        var minutes = x.getMinutes().toString()
        minutes = minutes.length == 1 ? 0 + minutes : minutes;
        var seconds = x.getSeconds().toString()
        seconds = seconds.length == 1 ? 0 + seconds : seconds;
        this.clock = Hours + ":" + minutes + ":" + seconds + ":" + ampm;
        this.display_c5();
      }, 1000)
  }

  async invoiceModal() {
    console.log(this.notificationData)
    const x = JSON.parse(this.notificationData.services);
    let service_name = [];
    for (let i = 0; i < x?.length; i++) {
      service_name.push(x[i].service.name);
    }
    const modal = await this.modalController.create({
      component: InvoicePage,
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      componentProps: {
        duration: this.duration,
        totalAmount: this.totalAmount,
        currency: 'AED',
        user_id: this.notificationData.user_id,
        bookingId: this.notificationData.booking_id,
        photo: JSON.parse(this.notificationData.user).imageUri === null ? null : JSON.parse(this.notificationData.user).imageUri,
        name: JSON.parse(this.notificationData.user).name,
        service_type: service_name,
        time: this.notificationData.time,
        location: this.notificationData.location,
        latitude: this.notificationData.latitude,
        longitude: this.notificationData.longitude,
        data: this.notificationData,

      }
    });
    // modal.onDidDismiss().then((invoice) => {
    //   const user = invoice;
    // });
    await modal.present();
  }

  // isservicestart() {
  //   return this.cart.servivestart;
  // }

}
