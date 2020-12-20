import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companies: any = []; 
  permissions: any = [];

  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  
  constructor(private companyService:CompanyService) {}

  ngOnInit() {
    this.getCompanies();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res => {
        this.companies=res;
      },
      err => console.error(err)
    );
  }


  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'companies.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'companies.edit')){
      this.canEdits = true;
    }
  }

  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'companies.create')){
      this.canCreates = true;
    }
  }


  deleteCompany(company:Company){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar a la empresa  ${company.Comercial_Name_Company}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.companyService.deleteCompany(company.IdMa_Company).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `El usuario ${company.Comercial_Name_Company} fue Eliminado` ,
              icon: 'success'
            });
            this.getCompanies();
          },
          err => console.error(err)
        );
      }
    });
  }


}
