import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ClientModel } from '../models/client.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  API_URI = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getClients(){
    return this.http.get(`${this.API_URI}/client`);
  }

  createOrUpdateClient(client:ClientModel){
    return this.http.post(`${this.API_URI}/client`,client);
  }

  deleteClient(idClient:Number){
    return this.http.delete(`${this.API_URI}/client/${idClient}`);
  }

  getClient(idClient:Number){
    return this.http.get(`${this.API_URI}/client/${idClient}`);
  };

}
