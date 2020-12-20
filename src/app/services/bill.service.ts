import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillModel } from '../models/bill.model';
import { from } from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BillService {

  API_URI = environment.apiUrl;
  

  constructor(private http:HttpClient) { }

  getBills(){
    return this.http.get(`${this.API_URI}/bill`);
  }

  createOrUpdateBill(bill:BillModel){
    return this.http.post(`${this.API_URI}/bill`,bill);
  }

  deleteBill(idBill:Number){
    return this.http.delete(`${this.API_URI}/bill/${idBill}`);
  }

  getBill(idBill:Number){
    return this.http.get(`${this.API_URI}/bill/${idBill}`);
  };

  postFile(file){
    return  this.http.post(`${this.API_URI}/bill/file`,file);
  }

  getBillsByStatus(status:string){
    return this.http.get(`${this.API_URI}/bill/status/${status}`);
  }
}
