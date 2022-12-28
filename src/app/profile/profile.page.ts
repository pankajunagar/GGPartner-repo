import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { UtilService } from "../services/util.service";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
// import { LZString } from 'lz-string';
var LZString = require('lz-string');
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  data: any = {};
  err: any = {};
  images: any = [1, 2, 3, 4];
  imageavtar: any;
  user_image: any;
  localImage: any = null;
  window: any;
  // editInfo: any = {
  //   name: undefined,
  //   email: undefined,
  //   phone_no: undefined
  // };
  editInfo: any = {
    name: 'emp',
    email: 'emp@gmail.com',
    phone_no: '+916985478569'
  };
  edit_info: boolean = false;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService,
    private cart: CartService,
    private router: Router,
    // private camera: Camera,
    private photoViewer: PhotoViewer,
    // private imagePicker: ImagePicker,
    private actionSheetController: ActionSheetController,
    // private androidPermission: AndroidPermissions,
    private platform: Platform,
    // private diagnostic: Diagnostic,
  ) {
    this.getUserData();
  }

  ngOnInit() {
  }

  onImageClick() {
    const options = {
      share: false, // default is false
      closeButton: false, // default is true
      copyToReference: false, // default is false
      headers: '',  // If this is not provided, an exception will be triggered
      piccasoOptions: {} // If this is not provided, an exception will be triggered
    };
    this.photoViewer.show(this.localImage, '', options);
  }

  async addImage() {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 8,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      const guestPicture = profilePicture.base64String;

      this.localImage = this.localImage === null ? null : ('data:image/jpeg;base64,' + guestPicture);
      this.cart.editProfile.image = this.localImage === null ? null : ('data:image/jpeg;base64,' + guestPicture);
      this.compress(guestPicture);
      // const param = {
      //   // id: id,
      //   image: guestPicture,
      // }
      // console.log(param);
      // debugger
      // this.util.startLoad();
      // this.api.postDataWithToken('employeeprofile/picture/update', param).subscribe((res: any) => {
      //   console.log(res);
      //   // debugger
      //   if (res.success === true) {
      //     this.localImage = res.data === null ? null : ('data:image/jpeg;base64,' + res.data);
      //     const image = res.data === null ? null : ('data:image/jpeg;base64,' + res.data);
      //     this.cart.editProfile.image = image;
      //     // this.getUserDate();
      //     this.util.dismissLoader();
      //   } else {
      //     this.util.dismissLoader();
      //     console.log('image not uploaded try again');
      //     this.util.presentToast('try again...');

      //   }
      // },
      //   (err) => {
      //     this.util.dismissLoader();
      //     // Handle error
      //     console.log(err)
      //     alert('CAMERA ERROR:-' + err);
      //   });
      // debugger
    } catch (error) {
      console.error(error);
    }
  }

  compress(guestPicture) {
    // console.log("Size of sample is: " + guestPicture.length);
    // var compressed = LZString.compress(guestPicture);
    // console.log("Size of compressed sample is: " + compressed.length);
    // let deCompressed = LZString.decompress(compressed);
    // console.log("Sample is: " + deCompressed);
    // debugger;
    const param = {
      // id: id,
      image: guestPicture,
    }
    console.log(param);
    // debugger
    this.util.startLoad();
    this.api.postDataWithToken('employeeprofile/picture/update', param).subscribe((res: any) => {
      console.log(res);
      // debugger
      if (res.success === true) {
        this.localImage = res.data === null ? null : res.data;
        const image = res.data === null ? null : res.data;
        this.cart.editProfile.image = image;
        // this.getUserDate();
        this.util.dismissLoader();
        this.util.presentToast('Image uploaded successfully');
      } else {
        this.util.dismissLoader();
        console.log('image not uploaded try again');
        this.util.presentToast('try again...');

      }
    },
      (err) => {
        this.util.dismissLoader();
        // Handle error
        console.log(err)
        alert('CAMERA ERROR:-' + err);
      });
  }

  saveInfo() {
    if (this.editInfo.phone_no.length < 5) {
      this.util.presentToast('length should be 10 digit');
    } else {
      const param = {
        name: this.editInfo.name,
        email: this.editInfo.email,
        phone_no: this.editInfo.phone_no,
      }
      debugger
      this.util.startLoad();
      this.api.postDataWithToken('employeeprofile/update', param).subscribe((res: any) => {
        console.log(res);
        this.edit_info = false;
        this.util.presentToast('Profile added successfully.')
        // debugger
        if (res.success === true) {
          // this.editInfo = {};
          this.api.getDataWithToken("employeeprofile/" + localStorage.getItem('userID')).subscribe(
            (data: any) => {
              // debugger
              console.log("lll");
              this.data = data.data[0].user;
              const info = data.data[0];
              // this.editInfo.name = info.name;
              // this.editInfo.phone_no = info.phone_no.split('+91')[1];
              // this.editInfo.email = info.email;
              // localStorage.removeItem('userImage');
              // this.localImage = info.user.image === null ? null : ('data:image/jpeg;base64,' + info.user.image);
              // const image = info.user.image === null ? null : ('data:image/jpeg;base64,' + info.user.image);
              // this.cart.editProfile.image = info.user.image === null ? null : 'data:image/jpeg;base64,' + info.user.image;
              this.cart.editProfile.name = info.user.name;
              this.cart.editProfile.phone_no = info.user.phone_no;
              this.cart.editProfile.email = info.user.email;
              this.util.dismissLoader();
            },
            (err) => {
              // debugger
              this.util.dismissLoader();
              this.util.presentToast(err)
            }
          );
          // this.getUserDate();
        }
      }, (err) => {
        this.util.dismissLoader();
        this.util.presentToast(err.error.errors.email[0])
      })
    }
  }

  editHere() {
    this.edit_info = true;
  }

  getUserData() {
    // debugger
    this.util.isUpdateProfile.subscribe((s) => {
      if (!s) {
        this.util.startLoad();
      }
      this.api.getDataWithToken("employeeprofile/" + localStorage.getItem('userID')).subscribe(
        (data: any) => {
          // debugger
          console.log(data);
          this.data = data.data[0].user;
          const res = data.data[0]
          this.editInfo.name = res.user.name;
          this.editInfo.phone_no = res.user.phone_no;
          this.editInfo.email = res.user.email;
          localStorage.removeItem('userImage');
          this.localImage = res.user.imageUri === null ? null : res.user.imageUri;
          const image = res.user.imageUri === null ? null : res.user.imageUri;
          this.cart.editProfile.image = image;
          this.cart.editProfile.name = res.user.name;
          this.cart.editProfile.phone_no = res.user.phone_no;
          this.cart.editProfile.email = res.user.email;
          // debugger
          this.util.dismissLoader();
          if (!s) {
            this.util.dismissLoader();
          }
        },
        (err) => {
          if (!s) {
            this.util.dismissLoader();
          }
          this.err = err.error.errors;
        }
      );
    });
  }

  logOut() {
    this.util.startLoad();
    window.localStorage.clear();
    setTimeout(() => {
      this.navCtrl.navigateRoot('/login');
      this.util.dismissLoader();
    }, 2000)
  }

}
