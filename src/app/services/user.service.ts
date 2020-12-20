import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {UserModel} from '../models/user.model';
import { RegistroModel } from '../models/Registro.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_URI = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get(`${this.API_URI}/user`);
  }
  
  createOrUpdateUser(user:UserModel){
    return this.http.post(`${this.API_URI}/user`,user);
  }
  
  deleteUser(idUser:Number){
    return this.http.delete(`${this.API_URI}/user/${idUser}`);
  }
  
  getUser(idUser:Number){
    return this.http.get(`${this.API_URI}/user/${idUser}`);
  };

  getIp(){
    return this.http.get('http://api.ipify.org/?format=json');
  }

  postRegistro(registroModel:RegistroModel){
    return this.http.post(`${this.API_URI}/user/registro`,registroModel);
  }

}