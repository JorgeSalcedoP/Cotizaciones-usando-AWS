import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFunctions(){
    return this.http.get(`${this.API_URI}/function`);
  }

  createOrUpdateFunction(functionBody:any){
    return this.http.post(`${this.API_URI}/function`,functionBody);
  }

  deleteFunction(idFunction:Number){
    return this.http.delete(`${this.API_URI}/function/${idFunction}`);
  }

  getFunction(idFunction:Number){
    return this.http.get(`${this.API_URI}/function/${idFunction}`);
  };

  getFunctionsByRole(idRole:Number){
    return this.http.get(`${this.API_URI}/function/permissions/${idRole}`);
  }
  
  
}
