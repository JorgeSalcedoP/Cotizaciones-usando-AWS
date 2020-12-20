import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ItemModel } from '../models/item.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  API_URI = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getItems(){
    return this.http.get(`${this.API_URI}/item`);
  }

  createOrUpdateItem(item:ItemModel){
    return this.http.post(`${this.API_URI}/item`,item);
  }

  deleteItem(idItem:Number){
    return this.http.delete(`${this.API_URI}/item/${idItem}`);
  }

  getItem(idItem:Number){
    return this.http.get(`${this.API_URI}/item/${idItem}`);
  };

  getItemsByService(idService:Number){
    return this.http.get(`${this.API_URI}/item/service/${idService}`);
  }


}