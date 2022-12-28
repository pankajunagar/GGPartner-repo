import { NavigationExtras } from '@angular/router';
import { ApiService } from "../../services/api.service";
import { Component, ViewChildren, QueryList, OnInit } from "@angular/core";
import { MenuController, NavController } from '@ionic/angular';
import { UtilService } from "../../../app/services/util.service";
import { Router } from "@angular/router";
import { CartService } from 'src/app/services/cart.service';

// var countries = require('../../../environments/country_code.json');
var flagdata = [
  { name: 'UAE', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_the_United_Arab_Emirates_%283-2%29.svg', callingCodes: '971' },
  { name: 'UNITED KINGDOM', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg', callingCodes: '44' },
  { name: 'INDIA', flag: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg', callingCodes: '91' },

]

interface Code {
  name: string;
  flag: string;
  callingCodes: string;
  code: {}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  data: any = {};
  err: any = {};
  country_code: any = flagdata;
  selectedCode: any = '971 https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_the_United_Arab_Emirates_%283-2%29.svg';

  phone_number: any;
  phone_num: any;
  showpassword = false;
  flagcountry: any = 'src\assets\flags\in.png';
  flagImage: any;

  constructor(
    private navCtrl: NavController,
    private util: UtilService,
    private api: ApiService,
    private cart: CartService
  ) { }

  ngOnInit() {
  }

  loadFlags() {
    console.log(this.selectedCode);
    // debugger
    setTimeout(function () {
      let radios = document.getElementsByClassName('alert-radio-label');
      for (let index = 0; index < radios.length; index++) {
        let element = radios[index];
        element.innerHTML = element.innerHTML.concat('<img  style = "position: absolute; right: 0; margin-right: 10px; margin-top:-2px; width: 45px;height:30px; flex-direction:flex-end"  src = "' + flagdata[index].flag + '" />');
      }
    }, 1000);
  }

  compareWith(o1: Code, o2: Code) {
    const x = o1 && o2 ? o1 === o2 : o1 === o2;
    // this.flagImage= o1 && o2 ? o1.flag === o2.flag : o1 === o2;
    // debugger
    return x;
  }

  switchMethod(x) {
    if (x === 'number') {
      this.data = {};
    }
    if (x === 'email' || x === 'password') {
      this.phone_number = ''

    }
  }


  Login(x) {
    if (x === 'byOtp') {
      this.getOTP()
    } else {
      if (this.data.email.match('@') != '@') {
        this.util.presentToast('enter valid email');
      } else if (this.data.password == '' || this.data.password == undefined) {
        this.util.presentToast('enter password');
      }
      else {
        this.singIn()
      }
    }

  }

  ////////////////////////"AFTER GETTING USER PHONE NUMBER OTP WILL GENERATE BY APP AND GET BY USER"/////////////////////////////////////
  getOTP() {
    console.log(this.selectedCode);
    // debugger
    let phone_num = this.phone_number.toString();
    if (phone_num.length < 5) {
      this.util.presentToast('length should be greater.')
    }
    else {
      const num = { phone_no: "+" + this.selectedCode.split(' ')[0].toString().concat(phone_num), device_token: this.cart.deviceToken };
      console.log(num);

      // debugger
      this.util.startLoad();
      this.api.postData('employeelogin', num).subscribe((res: any) => {
        console.log(res);
        // debugger
        if (res && res.success === true && res.OTP != '') {
          //navigate to otp page
          const param: NavigationExtras = {
            queryParams: {
              otp: res.OTP.otp,
              data: res.data,
              phone_no: num
            }
          };
          // debugger
          this.navCtrl.navigateForward('/otp-screen', param);
        } else if (res.success === false) {

          if (res.status === 'NA') {
            this.util.dismissLoader();
            this.util.presentToast(res.msg);
            this.navCtrl.navigateForward('signup');
          } else {
            this.util.dismissLoader();
            this.util.presentToast(res.msg);
          }

        }
        else {
          this.util.dismissLoader();
          this.util.presentToast('Account not exist. Please Register')
          // this.navCtrl.navigateForward('/signup')
        }
      },
        (err) => {
          this.util.dismissLoader();
          this.err = err.error.errors;
        })
    }
  }

  singIn() {
    this.util.startLoad();
    const cred = {
      email: this.data.email,
      password: this.data.password
    }
    debugger
    this.api.postData('employeeemaillogin', cred).subscribe((res: any) => {
      console.log(res);
      debugger
      if (res && res.success === true) {
        this.data.device_token = this.api.deviceToken;
        localStorage.clear();
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token_ID", res.data.token);
        localStorage.setItem("userID", res.data.id);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('phone_no', res.data.phone_no);
        localStorage.setItem('userName', res.data.name);
        let image = null;
        if (res.data.imageUri == null) {
          image = res.data.imageUri === null ? null : res.data.imageUri;
          // debugger
        } else {
          image = res.data.imageUri === null ? null : res.data.imageUri;
          // debugger
        }
        // localStorage.setItem('userImage', image);

        this.cart.editProfile.image = image;
        this.cart.editProfile.name = res.data.name;
        this.cart.editProfile.phone_no = res.data.phone_no;
        this.cart.editProfile.email = res.data.email;
        // debugger
        const param: NavigationExtras = {
          queryParams: {
            data: res.data,
            from: 'otpScreen'
          }
        };
        // this.navCtrl.navigateRoot("/tabs/home", param);
        this.navCtrl.navigateRoot("/tabs/home", param);
        this.util.presentToast('Login Successfully');
        this.util.dismissLoader();
      } else{
        this.util.presentToast(res.msg);
        this.util.dismissLoader();
      }
    }, (err) => {
      this.util.dismissLoader();
      console.log(err)
      this.util.presentToast(err.msg)
    })

  }

  ////////////////////////////////////////////////"SIGUP SCREEN NAVIGATION OPTION FUNCTION"///////////////////////////////////////////////////
  doSignUp() {
    this.navCtrl.navigateForward("/signup");
  }



}
