import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  forma: FormGroup;

  edit: boolean = false;

  company:  Company = {
    IdMa_Company: 0,
    Ruc_Company: '',
    Business_Name_Company:  '',
    Comercial_Name_Company: '',
    Tax_Residence_Company:  '',
    Creation_Date_Company: new Date(),
    Update_Date_Company: new Date(),
    Status_Company: true
  };  

  constructor(private companyService: CompanyService, private router:  Router,private activatedRoute:ActivatedRoute) { 
    this.forma = new FormGroup({
      Ruc_Company: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$')]),
      Business_Name_Company: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú. ]+$')]),
      Comercial_Name_Company: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú. ]+$')]),
      Tax_Residence_Company: new FormControl('',[Validators.required]),
    });
  }

  ngOnInit() {
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.companyService.getCompany(param.id).subscribe(
        res => {
          this.company=res[0];
          this.edit=true;
        },
        err => console.error(err)
      );
    }
  }

  createCompany(){
    this.companyService.createOrUpdateCompany(this.company).subscribe(
      res =>{
        console.log(res);
        var string=JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.insertId > 0){
          Swal.fire({
            title: 'Success',
            text: `La Empresa ${this.company.Comercial_Name_Company} fue agregada` ,
            icon: 'success'
          });
          this.router.navigate(['/companies']);
        }else{
          Swal.fire({
            title: 'Error',
            text: `Algo salio mal, La empresa no fue agregada..!!` ,
            icon: 'error'
          });
        }
      },
      err=> console.error(err)
    );
  }

  updateCompany(){
    this.company.Status_Company=true;
    this.companyService.createOrUpdateCompany(this.company).subscribe(
      res => {
        var string=JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.affectedRows > 0){
          Swal.fire({
            title: 'Success',
            text: `La Empresa ${this.company.Comercial_Name_Company} fue actualizada` ,
            icon: 'success'
          });
          this.router.navigate(['/companies']);
        }
      },
          err => console.error(err)
    );
  }

}
