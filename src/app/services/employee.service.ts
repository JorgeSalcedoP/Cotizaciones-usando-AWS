import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {EmployeeModel} from '../models/employee.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  API_URI = environment.apiUrl;

constructor(private http: HttpClient) { }

getEmployees(){
  return this.http.get(`${this.API_URI}/employee`);
}

createOrUpdateEmployee(employee:EmployeeModel){
  return this.http.post(`${this.API_URI}/employee`,employee);
}

deleteEmployee(idEmployee:Number){
  return this.http.delete(`${this.API_URI}/employee/${idEmployee}`);
}

getEmployee(idEmployee:Number){
  return this.http.get(`${this.API_URI}/employee/${idEmployee}`);
};

}