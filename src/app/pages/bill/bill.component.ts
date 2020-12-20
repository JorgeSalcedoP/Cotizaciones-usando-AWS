import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';

import { BillModel } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';
import { CompanyService } from 'src/app/services/company.service';

declare function formValidations();


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  selectedFiles: FileList;
  readers : string | ArrayBuffer;
  forma:FormGroup;
  edit:boolean = false;
  companies : any = [];
  saldoRestante:Number=0;

  bill : BillModel = {
    IdMa_Bill:0,
    Serie_Bill:'',
    Total_Bill:0,
    Document_Bill:'',
    Quotation_Serie:'',
    Osce_Serie:'',
    Creation_Bill: new Date(),
    Update_Bill:new Date(),
    Status_Bill:'',
    Moneda_Bill:'',
    Company_Id:0,
    Service_Description:''
  }

  constructor(private companyService: CompanyService,private billService:BillService,private router:  Router,private activatedRoute:ActivatedRoute) {
    this.forma = new FormGroup({
      Serie_Bill: new FormControl('',[Validators.required]),
      Total_Bill: new FormControl('',[Validators.required]),
      File_Bill:new FormControl(''),
      Document_Bill: new FormControl(''),
      Osce_Serie: new FormControl('',[Validators.required]),
      Quotation_Serie: new FormControl('',[Validators.required]),
      Status_Bill: new FormControl('',[Validators.required]),
      Moneda_Bill : new FormControl('',[Validators.required]),
      Company_Id:new FormControl('',[Validators.required]),
      Service_Description : new FormControl('',[Validators.required]),
    });  
   }

  ngOnInit() {
    formValidations();
    this.getCompanies();
    var Osce = JSON.parse(localStorage.getItem("Osce_Data"));
    if(Osce != undefined){
      console.log(Osce);
      this.bill.Quotation_Serie = Osce.Quotation_Serie;
      this.bill.Osce_Serie = Osce.Osce_Serie;
      this.bill.Moneda_Bill = Osce.Moneda_Osce;
      this.bill.Company_Id = Osce.Company_Id;
      this.bill.Service_Description = Osce.Service_Description;
      this.saldoRestante = Osce.SRestante_Osce;
      localStorage.removeItem("Osce_Data");
    }
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.billService.getBill(param.id).subscribe(
        res => {
          this.bill=res[0];
          this.edit=true;
        },
        err => console.error(err)
      );
    }
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res => {
        this.companies = res;
      },
      err => console.error(err)
    );
  }

  createBill(){

    if(this.bill.Total_Bill<this.saldoRestante){
      Swal.fire({
        title: 'warning',
        text: `El monto a facturar es menor a el valor de la OC` ,
        icon: 'warning'
      });
    }else{
      const file = this.selectedFiles.item(0);
      var data = {
        file : this.readers,
        name : file.name,
        type : file.type,
        folder:"factura"
      }
      this.billService.postFile(data).subscribe(
        res=>{
          if(!isNullOrUndefined(res)){
            var string = JSON.stringify(res);
            var json = JSON.parse(string);
            this.bill.Document_Bill = json.Location;
            this.billService.createOrUpdateBill(this.bill).subscribe(
              response => {
                console.log(response);
                var string=JSON.stringify(response);
                var json = JSON.parse(string);
                if(json.insertId > 0){
                  Swal.fire({
                    title: 'Success',
                    text: `La factura ${this.bill.Serie_Bill} fue agregada` ,
                    icon: 'success'
                  });
                  this.router.navigate(['/bills']);
                }else{
                  Swal.fire({
                    title: 'Error',
                    text: `Algo salio mal, La factura no fue agregada..!!` ,
                    icon: 'error'
                  });
                }
              },
              err => console.error(err)
            );
          }
        },
        err => console.error(err)
      );
    }
  }

  updateBill(){
    this.billService.createOrUpdateBill(this.bill).subscribe(
      res => {
        var string=JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.affectedRows > 0){
          Swal.fire({
            title: 'Success',
            text: `La factura ${this.bill.Serie_Bill} fue actualizada` ,
            icon: 'success'
          });
          this.router.navigate(['/bills']);
        }
      },
          err => console.error(err)
    );
  }
    
    selectFile(event) {
      this.selectedFiles = event.target.files;
      const file1 = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file1);
      reader.onload = () => {
          this.readers=reader.result;
      };
    }


}
