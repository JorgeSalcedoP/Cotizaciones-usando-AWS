import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Company} from '../models/company.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCompanies(){
    return this.http.get(`${this.API_URI}/company`);
  }

  createOrUpdateCompany(company:Company){
    return this.http.post(`${this.API_URI}/company`,company);
  }

  deleteCompany(idCompany:Number){
    return this.http.delete(`${this.API_URI}/company/${idCompany}`);
  }

  getCompany(idCompany:Number){
    return this.http.get(`${this.API_URI}/company/${idCompany}`);
  };

  getClients(idCompany:Number){
    return this.http.get(`${this.API_URI}/company/getcompanies/${idCompany}`);
  }
}
