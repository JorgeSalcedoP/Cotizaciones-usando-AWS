import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PermissionsModel } from '../models/Permissions.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPermissions(){
    return this.http.get(`${this.API_URI}/permissions`);
  }

  createOrUpdatePermission(permission:any[]){
    return this.http.post(`${this.API_URI}/permissions`,permission);
  }

  deletePermission(idPermission:Number){
    return this.http.delete(`${this.API_URI}/permissions/${idPermission}`);
  }

  getPermission(idPermission:Number){
    return this.http.get(`${this.API_URI}/permissions/${idPermission}`);
  };

  getPermissionsByFunction(idFunction:Number){
    return this.http.get(`${this.API_URI}/permissions/function/${idFunction}`);
  }
  getPermissionsByRole(idRole:Number){
    return this.http.get(`${this.API_URI}/permissions/role/${idRole}`);
  }
  
}
