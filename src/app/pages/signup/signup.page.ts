import { ServiceslistmodalPage } from './../../modal/serviceslistmodal/serviceslistmodal.page';
import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras, } from '@angular/router';
import { CartService } from "src/app/services/cart.service";

// var code = require('../../../environments/country_code.json');

var flagdata = [
  { name: 'UAE', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_the_United_Arab_Emirates_%283-2%29.svg', callingCodes: '971', length: 10 },
  { name: 'UNITED KINGDOM', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg', callingCodes: '44', length: 11 },
  { name: 'INDIA', flag: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg', callingCodes: '91', length: 10 },
]

interface Code {
  name: string;
  flag: string;
  callingCodes: string;
  code: {}
}

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  [x: string]: any;
  customOptions: any = {
    header: "Country Code",
  };
  data: any = {};
  err: any = {};
  country_code: any = flagdata;
  selectedCode: any = '971 https://upload.wikimedia.org/wikipedia/commons/3/3b/Flag_of_the_United_Arab_Emirates_%283-2%29.svg';
  phone_number: any;
  showpassword = false;
  services: any;
  servicesList: any = '';
  selectedServiceList: any = [];
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService,
    private cart: CartService,
    public modalController: ModalController,

  ) {
    this.serviceList()
  }

  ngOnInit() { }

  loadFlags() {
    console.log(this.selectedCode);
    // debugger
    setTimeout(function () {
      let radios = document.getElementsByClassName('alert-radio-label');
      for (let index = 0; index < radios.length; index++) {
        let element = radios[index];
        element.innerHTML = element.innerHTML.concat('<img class="country-image" style = "position: absolute; right: 0; margin-right: 10px; width: 45px;height:30px; margin-top:-2px; flex-direction:flex-end" src = "' + flagdata[index].flag + '" /> ');
      }
    }, 1000);
  }

  // doSignUp() {
  //   console.log(this.data);
  //   // localStorage.setItem("isLogin", "true");
  //   // this.data.device_token = this.api.deviceToken;
  //   // debugger
  //   this.util.startLoad();
  //   this.api.postData("register", this.data).subscribe(
  //     (res: any) => {
  //       console.log('SIGNUP RESPONSE', res);
  //       // debugger
  //       if (res.success) {
  //         // debugger
  //         this.util.dismissLoader();
  //         this.util.presentToast(res.msg);
  //         if (res.data.token) {
  //           this.navCtrl.navigateRoot("/tabs/home");
  //           localStorage.setItem("token", res.data.token);
  //           this.api.userToken = res.data.token;
  //         } else {
  //           if (res.flow == "verification") {
  //             this.api.verifyMo = this.data.phone_no;
  //             this.navCtrl.navigateForward("/phone-number");
  //           }
  //         }
  //       }
  //     },
  //     (err) => {
  //       this.util.dismissLoader();
  //       this.err = err.error.errors;
  //     }
  //   );
  // }

  // getOTP(){
  //   // console.log(this.data.name, this.data.email=='', this.phone_number=null )

  // }

  ////////////////////////////////////////////"AFTER SINGUP USER GET OTP FUNCTION"////////////////////////////////
  getOTP() {
    const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    this.util.startLoad();
    console.log(this.selectedCode);
    let phone_num = this.phone_number.toString();
    const code = "+" + this.selectedCode.split(' ')[0];
    this.data.phone_no = code.toString().concat(phone_num);
    if (phone_num.length < 5) {
      this.util.dismissLoader()
      this.util.presentToast('length should be 10 digit');
    } else if (this.data.email.match('@') != '@') {
      this.util.dismissLoader()
      this.util.presentToast('enter valid email');
    } else if (this.data.address === '' || this.data.address === undefined) {
      this.util.dismissLoader()
      this.util.presentToast('Please enter your address.');
    } else if (this.selectedServiceList.length === 0) {
      this.util.dismissLoader()
      this.util.presentToast('Please select services')
    } else {
      const param = {
        name: this.data.name,
        email: this.data.email,
        phone_no: this.data.phone_no,
        address: this.data.address,
        service: this.selectedServiceList,
        password: this.data.password
        // device_token: this.cart.deviceToken
      };
      console.log(param);
      this.api.postData('employeeregister', param).subscribe((res: any) => {
        console.log(res)
        // debugger
        if (res.success === true) {
          // if (res && res.data.OTP != '' && res.data.OTP != null) {
          //   this.util.dismissLoader();
          //   //navigate to otp page
          //   const param: NavigationExtras = {
          //     queryParams: {
          //       otp: res.data.OTP,
          //       data: res.data
          //     }
          //   };
          //   this.navCtrl.navigateForward('/otp', param);
          // } else {
          //   this.util.dismissLoader();
          //   this.util.presentToast('Server Database is not available')
          // }
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
          this.navCtrl.navigateBack('login');
        }
        else {
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
        }
      },
        (err) => {
          this.util.dismissLoader();
          this.util.presentToast('internal server error');
        })
    }
  }

  /////////////////////////////////////////////////////////"NAVIGATE TO SINGIN PAGE"///////////////////////////////////////////////
  doSignIn() {
    this.navCtrl.navigateBack("/login");
  }

  serviceList() {
    this.api.getData('servicelist').subscribe((res: any) => {
      console.log(res);
      // debugger
      // this.cart.servicesList = res.data;
      this.servicesList = res.data;
    })
  }

  async servicesListModal(servicesList) {

    servicesList.forEach(element => {
      element.isChecked = false;
    });

    const modal = await this.modalController.create({
      component: ServiceslistmodalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        servicesList: servicesList
      }
    });

    modal.onDidDismiss().then((data) => {
      this.selectedServiceList = data.data.serviceList
      //  debugger
    });
    await modal.present();

  }
}
