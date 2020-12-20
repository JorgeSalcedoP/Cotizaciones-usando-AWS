import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import {environment} from '../../environments/environment';

import {UserModel} from '../models/user.model';
import {EmployeeModel} from '../models/employee.model';
import {PermissionsModel} from '../models/Permissions.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getConnection(user:UserModel):Observable<any>{
    const datos = {
      "user":user.Email_User,
      "password":user.Password_User,
      "userId":user.IdMa_User
    }
    return this.http.post<UserModel>(`${this.API_URI}/authentication`,datos).pipe(map(data=>data));
  }

  getPermissions(idUser:Number){

    const datos = {
      "user":'',
      "password":'',
      "userId":idUser
    }

    return this.http.post(`${this.API_URI}/authentication`,datos).pipe(map(data=>data));
  }

  setUser(user: UserModel): void {
    user.Password_User = "";
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setEmployee(employee:EmployeeModel):void{
    let employee_string = JSON.stringify(employee);
    localStorage.setItem("currentEmployee",employee_string);
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser(): UserModel {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: UserModel = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  getCurrenEmployee(): EmployeeModel {
    let employee_string = localStorage.getItem("currentEmployee");
    if (!isNullOrUndefined(employee_string)) {
      let employee: EmployeeModel = JSON.parse(employee_string);
      return employee;
    } else {
      return null;
    }
  }

  logoutUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("permissionsByUser");
  }



}
