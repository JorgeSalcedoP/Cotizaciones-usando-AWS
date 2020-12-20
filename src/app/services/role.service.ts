import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RoleModel } from '../models/role.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoleService {


  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRoles(){
    return this.http.get(`${this.API_URI}/roles`);
  }

  createOrUpdateRole(role:RoleModel){
    return this.http.post(`${this.API_URI}/roles`,role);
  }

  deleteRole(idRole:Number){
    return this.http.delete(`${this.API_URI}/roles/${idRole}`);
  }

  getRole(idRole:Number){
    return this.http.get(`${this.API_URI}/roles/${idRole}`);
  };

}
