import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  userModel:UserModel = {
    IdMa_User: 0,
    Name_User: '',
    Email_User: '',
    Password_User:'',
    Employee_Id:0,
    Roles_Id:0,
    Creation_User: new Date(),
    Updated_User: new Date(),
    Status_User: 'Habilitado'
  } ;

  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { 
  }

  getQuotations(){
    this.userModel = JSON.parse(localStorage.getItem("currentUser")); 
    let param1 =  new HttpParams().set("userId",''+this.userModel.IdMa_User).set("roleId",''+this.userModel.Roles_Id);
    return this.http.get(`${this.API_URI}/quotation`,{responseType:"json",params:param1});
  }

  createOrUpdateQuotation(quotation){
    return this.http.post(`${this.API_URI}/quotation`,quotation);
  }

  deleteQuotation(idQuotation:Number){
    return this.http.delete(`${this.API_URI}/quotation/${idQuotation}`);
  }

  getQuotation(idQuotation:Number){
    return this.http.get(`${this.API_URI}/quotation/${idQuotation}`);
  };

  getCorrelativo(){
    return this.http.get(`${this.API_URI}/quotation/correlativo`);
  }

  getQuotationsByStatus(status:string){
    this.userModel = JSON.parse(localStorage.getItem("currentUser")); 
    let param1 =  new HttpParams().set("userId",''+this.userModel.IdMa_User).set("roleId",''+this.userModel.Roles_Id);    
    return this.http.get(`${this.API_URI}/quotation/status/${status}`,{responseType:"json",params:param1});
  }

  getQuotationBySerie(json){
    return this.http.post(`${this.API_URI}/quotation/serie`,json);
  }

  postFile(file){
    return  this.http.post(`${this.API_URI}/quotation/file`,file);
  }

  getQuotationsByUser(idUser:Number){
    return this.http.get(`${this.API_URI}/quotation/user/${idUser}`);
  }
}
