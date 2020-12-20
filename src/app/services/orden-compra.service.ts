import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OrdenCompraModel } from '../models/ordenCompra.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  API_URI = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getOrders(){
    return this.http.get(`${this.API_URI}/osce`);
  }
  
  createOrUpdateOrder(orderCompra:OrdenCompraModel){
    return this.http.post(`${this.API_URI}/osce`,orderCompra);
  }
  
  deleteOrder(idOrder:Number){
    return this.http.delete(`${this.API_URI}/osce/${idOrder}`);
  }
  
  getOrder(idOrder:Number){
    return this.http.get(`${this.API_URI}/osce/${idOrder}`);
  };

  postFile(file){
    return  this.http.post(`${this.API_URI}/osce/file`,file);
  }

  postFiles(file){
    return  this.http.post(`${this.API_URI}/osce/files`,file);
  }

  getOrdersByStatus(status:string){
    return this.http.get(`${this.API_URI}/osce/status/${status}`);
  }
  
}
