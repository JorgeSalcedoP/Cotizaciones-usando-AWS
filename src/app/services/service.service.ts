import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ServiceModel } from '../models/service.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getServices(){
    return this.http.get(`${this.API_URI}/service`);
  }

  createOrUpdateService(service:ServiceModel){
    return this.http.post(`${this.API_URI}/service`,service);
  }

  deleteService(idService:Number){
    return this.http.delete(`${this.API_URI}/service/${idService}`);
  }

  getService(idService:Number){
    return this.http.get(`${this.API_URI}/service/${idService}`);
  };

}