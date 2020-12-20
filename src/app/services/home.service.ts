import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTotalQuotations(){
    return this.http.get(`${this.API_URI}/home/0`);
  }

  getTotalOrders(){
    return this.http.get(`${this.API_URI}/home/1`);
  }

  getTotalBills(){
    return this.http.get(`${this.API_URI}/home/2`);
  }

  getReportQuotations(){
    return this.http.get(`${this.API_URI}/home/3`);
  }

}
