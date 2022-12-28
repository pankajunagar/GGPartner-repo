// import { CartService } from 'src/app/services/cart.service';
import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { BehaviorSubject } from 'rxjs'
import { exit } from "process";
import { ActivatedRoute, Router, NavigationExtras, } from '@angular/router';
import { CartService } from "src/app/services/cart.service";


@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.page.html',
  styleUrls: ['./otp-screen.page.scss'],
})
export class OtpScreenPage implements OnInit {

  data: any = {};
  otp: any = {};
  err: any = {};
  code: any = [];
  saveOtp: any;
  timerOn: boolean = true;
  remtime: any;
  userData: any;
  userPhone_no: any;
  state: 'start' | 'stop' = 'start';
  PHONE_NO: any;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService,
    private route: ActivatedRoute,
    private cart: CartService
  ) {
    this.util.dismissLoader();

    ///////////////////////////////////////"GETTING DATA FROM PREVIOUS SCREEN"//////////////////////////////
    this.route.queryParams.subscribe(data => {

      console.log(data);
      // debugger
      this.userData = data.data;
      // debugger
      this.userPhone_no = data.data.phone_no;
      this.saveOtp = data.otp;

    });
    this.countdown(90);
  }

  ngOnInit() {
  }

  /////////////////////////////"TIMER TO GET OTP IN LIMITED TIME"///////////////////////////
  countdown(remaining,) {
    this.state = 'start';
    let m: any = Math.floor(remaining / 60);
    let s: any = remaining % 60;

    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;
    this.remtime = m + ':' + s;
    remaining -= 1;

    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        console.log(remaining);
        this.countdown(remaining);
      }, 1000);
      return;
    } else {
      this.state = 'stop';
    }
  }

  moveFocus(event, nextElement, previousElement) {
    // debugger
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = "";
    }
  }

  otpController(event, next, prev) {

    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    }
    else if (next && event.target.value.length > 0) {
      this.code.push(event.target.value);
      next.setFocus();
    }
    else {
      // debugger
      this.code.push(event.target.value);
      const OTPstring = this.code.toString().replace(/,/g, '');
      this.code = [];
      console.log(OTPstring);
      // debugger
      if (this.saveOtp === OTPstring) {
        // debugger
        if (this.state === 'start') {
          this.timerOn = false
          this.data.device_token = this.api.deviceToken;
          localStorage.clear();
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("token_ID", this.userData.token);
          localStorage.setItem("userID", this.userData.id);
          localStorage.setItem('email', this.userData.email);
          localStorage.setItem('phone_no', this.userData.phone_no);
          localStorage.setItem('userName', this.userData.name);
          let image = null;
          if (this.userData.imageUri == null) {
            image = this.userData.imageUri === null ? null : this.userData.imageUri;
            // debugger
          } else {
            image = this.userData.imageUri === null ? null : this.userData.imageUri;
            // debugger
          }
          // localStorage.setItem('userImage', image);

          this.cart.editProfile.image = image;
          this.cart.editProfile.name = this.userData.name;
          this.cart.editProfile.phone_no = this.userData.phone_no;
          this.cart.editProfile.email = this.userData.email;
          // debugger
          const param: NavigationExtras = {
            queryParams: {
              data: this.userData,
              from: 'otpScreen'
            }
          };
          this.navCtrl.navigateRoot("/tabs/home", param);
        } else {
          this.util.presentToast('please Resend request for OTP.')
        }
      } else {
        this.util.presentToast('OTP is incorrect');
      }
    }
  }

  //////////////////////////////////////"RE - SEND OTP CALL function"//////////////////////////////////////

  reSendOTP() {
    this.util.startLoad();

    const param = { phone_no: this.userPhone_no }
    this.countdown(90);
    this.api.postData('login', param).subscribe((res: any) => {
      console.log(res);
      // debugger
      if (res && res.success === true && res.OTP != '') {
        this.saveOtp = res.OTP.otp;
        this.util.dismissLoader();
      } else {
        this.util.dismissLoader();
        this.util.presentToast('Please Verify your account')
      }
    },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      })
  }

}
