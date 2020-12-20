import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { HomeService } from 'src/app/services/home.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';
import { UserModel } from 'src/app/models/user.model';
import { join } from 'path';
import { UserService } from 'src/app/services/user.service';
import { RegistroModel } from 'src/app/models/Registro.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {

  reporte = {
    since_date: '',
    to_date: '',
    company_name : ''
  }

  registroModel: RegistroModel = {
    IdMa_Registro:0,
    Usuario_Registro:"",
    Ip_Registro:"",
    Action_Registro:"CALL",
    Sentence_Registro:"CALL SP_getAllData()",
    Date_Registro: new Date()
  }

  userModel:UserModel;

  constructor(private userService:UserService,private excelService:ExcelService, private datePipe: DatePipe,private companyService:CompanyService,private homeService:HomeService) {
    this.forma = new FormGroup({
      sinceDate: new FormControl(''),
      toDate: new FormControl(''),
      company: new FormControl('') 
    });
   }

  permissions: any = [];
  companies:any = [];
  quotations:any = [];
  quotationsSelect : any = [];
  forma:FormGroup;
  p:number = 1;
  canCreates:boolean;

  ngOnInit() {
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canCreate();
    this.getCompanies();
    this.getReport();
    this.getCurrentIp();
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res => {
        this.companies=res;
      },
      err => console.error(err)
    );
  }

  getReport(){
    this.homeService.getReportQuotations().subscribe(
      res =>{
        this.quotations = res[0];
        this.quotationsSelect = res[0];
      },
      err => console.error(err)
    );
  }

  sinceChange(){
    console.log(this.quotations);
    if(this.reporte.to_date === '' && this.reporte.company_name === ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy'));
      this.quotations=filter;
    }else if(this.reporte.to_date === '' && this.reporte.company_name != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }else if(this.reporte.to_date != '' && this.reporte.company_name === ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.FECHA <= this.datePipe.transform(this.reporte.to_date,'dd/MM/yy'));
      this.quotations=filter;
    }else if(this.reporte.to_date != '' && this.reporte.company_name != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.FECHA <= this.datePipe.transform(this.reporte.to_date,'dd/MM/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }

  }
  toChange(){
    if(this.reporte.since_date === '' && this.reporte.company_name === ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA <= this.datePipe.transform(this.reporte.to_date,'MM/dd/yy'));
      this.quotations=filter;
    }else if(this.reporte.since_date === '' && this.reporte.company_name != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA <= this.datePipe.transform(this.reporte.to_date,'MM/dd/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }else if(this.reporte.since_date != '' && this.reporte.company_name === ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.FECHA <= this.datePipe.transform(this.reporte.to_date,'dd/MM/yy'));
      this.quotations=filter;
    }else if(this.reporte.since_date != '' && this.reporte.company_name != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.FECHA <= this.datePipe.transform(this.reporte.to_date,'dd/MM/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }
  }

  companyChange(){
    if(this.reporte.since_date === '' && this.reporte.to_date === ''){
      let filter = this.quotationsSelect.filter(item => item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }else if(this.reporte.since_date === '' && this.reporte.to_date != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA <= this.datePipe.transform(this.reporte.to_date,'MM/dd/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }else if(this.reporte.since_date != '' && this.reporte.to_date === ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }else if(this.reporte.since_date != '' && this.reporte.to_date != ''){
      let filter = this.quotationsSelect.filter(item => item.FECHA >= this.datePipe.transform(this.reporte.since_date,'MM/dd/yy') && item.FECHA <= this.datePipe.transform(this.reporte.to_date,'dd/MM/yy') && item.EMPRESA === this.reporte.company_name);
      this.quotations=filter;
    }
  }

  cleanFilter(){
    this.reporte.since_date = '',
    this.reporte.to_date = '';
    this.reporte.company_name = '';
    this.getReport();
  }


  getCurrentUser(){
    this.userModel=JSON.parse(localStorage.getItem("currentUser"));
    this.registroModel.Usuario_Registro = this.userModel.Email_User;
  }

  getCurrentIp(){
    this.userService.getIp().subscribe(
      res => {
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.ip != undefined){
          this.registroModel.Ip_Registro  = json.ip;
        }
      },
      err => console.error(err)
    );
  }


  exportAsXLSX(){

    let table = [];
    this.quotations.forEach(item => {
      let row = [item.AREA,item.ENCARGADO,item.FECHA,item.MES,item.CLIENTE,item.EMPRESA,item.N_COTIZACION,item.ESTADO_COTIZACION,item.IMPORTE,item.SALDO_RESTANTE,item.SERVICIO,item.TIPO_DE_TRABAJO,item.URL_COTIZACION,item.OC,item.N_OC,item.ESTADO_OC,item.FECHA_DE_REGISTRO,item.MONEDA,item.IMPORTE_NETO,item.URL_OC,item.URL_DOCUMENTOS,item.FACTURA,item.N_FACTURA,item.ESTADO_FACTURA,item.FECHA_FACTURA,item.IMPORTE_FACTURA,item.PAGADO,item.URL_FACTURA];
      table.push(row);
    });
    this.excelService.generateExcel(table);

  }


  generateExcel(){
    this.getCurrentUser();
    this.getCurrentIp();

    this.userService.postRegistro(this.registroModel).subscribe(
      res => {
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if (json.affectedRows > 0) {
          this.exportAsXLSX();
        }else{
          Swal.fire({
            title: 'Error',
            text: `No se pudó generar el reporte`,
            icon: 'error'
          });
        }
      },
      err => console.error(err)
    );
  }


  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'report.create')){
      this.canCreates = true;
    }
  }

}
