import { NavigationExtras } from '@angular/router';
import { ApiService } from "./services/api.service";
import { Component, ViewChildren, QueryList, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { UtilService } from "../app/services/util.service";
import { Router } from "@angular/router";
import { Location } from '@angular/common';

import {
  Platform,
  NavController,
  ToastController,
  IonRouterOutlet,
} from "@ionic/angular";
import { CartService } from './services/cart.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NotificationPage } from './modal/notification/notification.page';
// import { Tab1Page } from './home/tab1.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private _location: Location,

    // private splashScreen: SplashScree,
    // private statusBar: StatusBar,
    private api: ApiService,
    private router: Router,
    // private oneSignal: OneSignal,
    private navCtrl: NavController,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private cart: CartService,
    private util: UtilService,
    public modalController: ModalController,
    public alertController: AlertController,
    // public home: Tab1Page
  ) {
  }

  ngOnInit() {
    this.backButtonEvent();
    if (localStorage.getItem("token_ID")) {
      // debugger
      console.log('USER TOKEN IS', localStorage.getItem("token_ID"))
      this.getUserProfileData();
      this.navCtrl.navigateRoot("/tabs/home");
    } else {
      this.navCtrl.navigateRoot("login");
      // this.navCtrl.navigateRoot("/tabs/home");
    }
    this.getNotificationToken();
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(999, async () => {
      console.log('Back Button --------------->>>', this.router.url, 'ad',);
      if (this.router.url === '/login') {
        navigator['app'].exitApp();
      } else if (this.router.url === '/signup') {
        this.navCtrl.back();
      }
    });
  }

  getNotificationToken() {
    console.log('Initializing HomePage');
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
        console.log('error')
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        this.cart.deviceToken = token.value;
        // debugger
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
      }
    );

  }


  getUserProfileData() {
    // this.cart.cart = [];
    // const param
    this.util.startLoad();
    this.util.isUpdateProfile.subscribe((s) => {
      if (!s) {
        this.util.startLoad();
      }
      this.api.getDataWithToken("employeeprofile/" + localStorage.getItem('userID')).subscribe(
        (data: any) => {
          console.log('USER PROFILE DATA', data.data[0])
          const res = data.data[0];
          // debugger
          // const imageUri = res.user.imageUri === null ? null : res.user.imageUri === undefined ? null : 'data:imageUri/jpeg;base64,' + res.user.imageUri;
          const image = res.user.imageUri === null ? null : res.user.imageUri === undefined ? null : res.user.imageUri;
          this.cart.editProfile.image = image;
          this.cart.editProfile.name = res.user.name;
          this.cart.editProfile.phone_no = res.user.phone_no;
          this.cart.editProfile.email = res.user.email;
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('phone_no', res.user.phone_no);
          localStorage.setItem('email', res.user.email);
          this.util.dismissLoader();
          // debugger
          if (!s) {
            this.util.dismissLoader();
          }
        },
        (err) => {
          if (!s) {
            this.util.dismissLoader();
          }
          // this.err = err.error.errors;
          console.log(err);
        }
      );
    });
  }


}
