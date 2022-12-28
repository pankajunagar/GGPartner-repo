import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "./../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = environment.baseUrl;
  category: any;
  userToken: any;
  deviceToken: any;
  verifyMo: any;
  phone_no: any;
  id: any;
  // bookid: any;
  time: any = {};
  constructor(private http: HttpClient) {
    if (localStorage.getItem("token_ID")) {
      this.userToken = localStorage.getItem("token_ID");

    }
  }
  getData(url) {
    return this.http.get(this.baseUrl + url);
  }

  postData(url, data) {
    console.log("jjj");
    return this.http.post(this.baseUrl + url, data);
  }

  getDataWithToken(url) {
    const userToken = localStorage.getItem("token_ID");
    let header = new HttpHeaders();
    header = header.set("Authorization", "Bearer " + userToken);
    header = header.set("Accept", "application/json");
    return this.http.get(this.baseUrl + url, { headers: header });
  }

  postDataWithToken(url, data) {
    const userToken = localStorage.getItem("token_ID");
    let header = new HttpHeaders();
    header = header.set("Authorization", "Bearer " + userToken);
    header = header.set("Accept", "application/json");
    return this.http.post(this.baseUrl + url, data, { headers: header });
  }
}

