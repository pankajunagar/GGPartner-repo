import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public servicesList: any = '';
  public coords: any = {
    lat: 28.644800,
    lng: 71.216721
  }

  servivestart: boolean = false;

  public editProfile: any = {
    image: null,
    name: null,
    email: null,
    phone_no: null
  };

  public deviceToken: any = '';

  constructor() { }
}
