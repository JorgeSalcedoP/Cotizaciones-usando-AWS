import { Component, OnInit } from '@angular/core';
import { Resume } from '../../models/resume.model';
import { QuotationService } from '../../services/quotation.service';

import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationModel } from 'src/app/models/Quotation.model';
import { AuthenticatedService } from 'src/app/services/authenticated.service';
import { UserModel } from 'src/app/models/user.model';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css']
})
export class QuotationsComponent implements OnInit {

  quotations: any = []; 
  permissions: any = [];
  userVacio : UserModel;

  canCreateOrder : boolean = false;
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;

  constructor(private excelService:ExcelService,private router:Router,private quotationService : QuotationService,private activatedRoute:ActivatedRoute,private authenticatedService:AuthenticatedService) { }

  ngOnInit() {
    this.getQuotations();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  getQuotations(){
    const param = this.activatedRoute.snapshot.params;
    if(isNullOrUndefined(param.status)){
      this.quotationService.getQuotations().subscribe(
        res => {
          console.log(res);
          this.quotations = res;
        },
        err => console.error(err)
      );
    }else{
      if(param.status === 'Aprobada'){
        this.canCreateOrders();
      }
      this.quotationService.getQuotationsByStatus(param.status).subscribe(
        res => {
          console.log(res);
          this.quotations = res;
        },
        err => console.error(err)
      );
    }
  }

  canCreateOrders(){
    this.getPermissionsByUser();
    if(this.permissions.find(item => item.Slug_Permissions === 'orders.create')){
      this.canCreateOrder = true;
    }
  }

  getPermissionsByUser(){
    if(isNullOrUndefined(localStorage.getItem("permissionsByUser"))){
      this.userVacio = JSON.parse(localStorage.getItem("currentUser"));
      this.authenticatedService.getPermissions(this.userVacio.IdMa_User).subscribe(
        res=>{
          this.permissions = res;
        },
        err => console.error(err)
      );
    }else{
      this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    }
  }

  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'quotation.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'quotation.edit')){
      this.canEdits = true;
    }
  } 
  
  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'quotation.create')){
      this.canCreates = true;
    }
  }  

  deleteOrder(quotation:QuotationModel){
    console.log(quotation);
  }

  createOrder(quotation){
    console.log(quotation);
    var json = {
      Serie_Quotation:quotation.Serie_Quotation,
      Company_Id:quotation.Company_Id,
      SRestante_Quotation:quotation.SRestante_Quotation,
      service_Description : quotation.Title_Quotation,
      Total_Quotation:0
    }

    localStorage.setItem("Quotation_Data",JSON.stringify(json));
    this.router.navigate(['/osce/nuevo']);
  }



}
