import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper,Table ,Img,Txt,Canvas,Line,Cell, Item } from 'pdfmake-wrapper';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { ClientModel }  from '../../models/client.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeModel } from 'src/app/models/employee.model';
import { QuotationService } from 'src/app/services/quotation.service';
import { ItemService } from 'src/app/services/item.service';
import { ServiceService } from 'src/app/services/service.service';
import { ServiceModel } from 'src/app/models/service.model';
import { ItemModel } from 'src/app/models/item.model';

import { Resume,Body } from '../../models/resume.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UserModel } from 'src/app/models/user.model';

declare function formValidations();


@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
  providers: [DatePipe]
})
export class QuotationComponent implements OnInit {

  forma:FormGroup;

  edit: boolean = false;

  resume = new Resume();

  companyPDF:  Company = {
    IdMa_Company: 0,
    Ruc_Company: '',
    Business_Name_Company:  '',
    Comercial_Name_Company: '',
    Tax_Residence_Company:  '',
    Creation_Date_Company: new Date(),
    Update_Date_Company: new Date(),
    Status_Company: true
  };
  clientPDF : ClientModel = {
    IdMa_Client: 0,
    Name_Client:'',
    Lastname_Client:'',
    Area_Client:'',
    Phone_Client:'',
    Mobile_Client:'',
    Email_Client:'',
    Company_Id:0,
    Creation_Client:new Date(),
    Update_Client:new Date(),
    Status_Client:true,
  }
  clienteModel : ClientModel = {
    IdMa_Client: 0,
    Name_Client:'',
    Lastname_Client:'',
    Area_Client:'',
    Phone_Client:'',
    Mobile_Client:'',
    Email_Client:'',
    Company_Id:0,
    Creation_Client:new Date(),
    Update_Client:new Date(),
    Status_Client:true,
  }
  employeeModel: EmployeeModel = {
    IdMa_Employee: 0,
    Name_Employee: '',
    Lastname_Employee: '',
    Mobile_Employee: '',
    Email_Employee: '',
    Birthdate_Employee: new Date(),
    Area_Employee: '',
    Creation_Employee: new Date(),
    Update_Employee: new Date(),
    Status_Employee: true
  }

  userModel : UserModel = {
    IdMa_User: 0,
    Name_User: '',
    Email_User: '',
    Password_User:'',
    Employee_Id:0,
    Roles_Id:0,
    Creation_User: new Date(),
    Updated_User: new Date(),
    Status_User: ''
  }

  itemModel : ItemModel = {
    IdMa_Item: 0,
    Description_Item: '',
    Brand_Item: '',
    Partnumber_Item: 0,
    Unit_Item: '',
    PUnitary_Item:0,
    Creation_Item: new Date(),
    Update_Item: new Date(),
    Status_Item: true,
    Service_Id:0,
  }

  constructor(private datePipe: DatePipe,
    private companyService:CompanyService,
    private employeeService:EmployeeService,
    private quotationService:QuotationService,
    private itemService: ItemService,
    private serviceServices: ServiceService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {
    
   }
  
  ngOnInit() {
    formValidations();
    this.getSerie();
    this.getCompanies();
    this.getServices();
    
  }

  companies :any =[];
  clients :  any = [];
  services : any = [];
  items : any = [];
  myDate = new Date();
  validez : number;
  datoCoti : any;
  

  getItem(i){
    let data = this.items.filter(item => item.Description_Item === this.resume.body[i].Description_Cuerp);
    if(data.length>0){
      this.resume.body[i].Item_Cuerp = i+1;
      this.resume.body[i].IdCuerp_Cuerp = data[0].IdMa_Item;
      this.resume.body[i].Brand_Cuerp = data[0].Brand_Item;
      this.resume.body[i].PartNumber_Cuerp = data[0].Partnumber_Item;
      this.resume.body[i].Unity_Cuerp = data[0].Unit_Item;
      this.resume.body[i].PUnitary_Cuerp = data[0].PUnitary_Item;
      if(this.resume.body[i].Quantity_Cuerp >= 0){
        this.resume.body[i].PSubtotal_Cuerp = +this.resume.body[i].Quantity_Cuerp * data[0].PUnitary_Item
      }else{
        this.resume.body[i].PSubtotal_Cuerp = 0;
      }
    }
  }

  getDataPDF(){
    this.resume.Serie_Quotation=this.resume.Area_Quotation+"-"+this.datoCoti;
    const table = [];
    let title  = ['',new Txt(this.resume.Title_Quotation).bold().end,'','','','','',''];
    table.push(title);
    for(var i = 0 ; i<this.resume.body.length;i++){
      var Psubtotal = +this.resume.body[i].Quantity_Cuerp * +this.resume.body[i].PUnitary_Cuerp;
      this.resume.body[i].PSubtotal_Cuerp = Psubtotal;
      let row = [this.resume.body[i].Item_Cuerp,this.resume.body[i].Description_Cuerp,this.resume.body[i].Brand_Cuerp,this.resume.body[i].Quantity_Cuerp,this.resume.body[i].PartNumber_Cuerp,this.resume.body[i].Unity_Cuerp,this.resume.body[i].PUnitary_Cuerp,Psubtotal];
      table.push(row);
      let obs = [];
      if(this.resume.body[i].Observation_Cuerp != undefined){
        obs = ['',this.resume.body[i].Observation_Cuerp,'','','','','',''];
        table.push(obs);
      }
    }
    return table;
  };

  getSerie(){
    this.quotationService.getCorrelativo().subscribe(
      res => {
        this.datoCoti = res[0].Serie;
      },
      err => console.error(err)
    );
  }

  getTotal(){
    var total = 0;
    for(var i = 0 ; i<this.resume.body.length;i++){
      total = total + +this.resume.body[i].PSubtotal_Cuerp;
    }
    this.resume.Total_Quotation=total; 
    return total;
  }

  getServices(){
    this.serviceServices.getServices().subscribe(
      res => {
        this.services = res;
      },
      err => console.error(err)
    );
  }

  deleteItem(index){
    let item = this.resume.body.filter(item => item.Description_Cuerp === this.resume.body[index].Description_Cuerp );
    var i = this.resume.body.indexOf( item[0] );
 
    if ( i !== -1 ) {
      this.resume.body.splice( i, 1 );
    }
  }

  addBody(){
    this.resume.body.push(new Body());
  }

  getItemsByService(){
    if(this.resume.Service_Id > 0){
      this.itemService.getItemsByService(this.resume.Service_Id).subscribe(
        res =>{
          this.items = res;
        },
        err => console.error(err)
      );
    }else{
      this.items = [];
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

  getCompany(){
    
    let company = this.companies.filter(item => item.IdMa_Company == this.resume.Company_Id );
    this.companyPDF = company[0];

    if(this.resume.Company_Id > 0 ){
      this.companyService.getClients(this.resume.Company_Id).subscribe(
        res => {
          this.clients = res;
          this.clientPDF = this.clienteModel;
        },
        err => console.error(err)
      );
    }
    
  }

  getClient(){
    if(this.clients.length > 0){
      let client = this.clients.filter(item => item.IdMa_Client == this.resume.Client_Id );
      this.clientPDF = client[0];
    }else{
      this.clientPDF = this.clienteModel;
    }
  }

  generatePDF(){

    var mensaje = [];
    if(this.resume.Area_Quotation === undefined){
      mensaje.push("Seleccione el área de la cotización");
    }
    if(this.resume.Service_Id == 0){
      mensaje.push("Seleccione el servicio");
    }
    if(this.resume.Company_Id === undefined){
      mensaje.push("Seleccione la empresa");
    }
    if(this.resume.Client_Id === undefined){
      mensaje.push("Seleccione el cliente");
    }
    if(this.resume.Title_Quotation === undefined){
      mensaje.push("Ingrese el título de la cotización");
    }
    if(this.resume.Validez_Quotation === undefined){
      mensaje.push("Ingrese la validez de la cotización");
    }

    this.resume.body.forEach(item => {
      if(item.Quantity_Cuerp === undefined){
        mensaje.push("Verifique las cantidades ingresadas.");
      }
    });
    if(mensaje.length > 0){
      var htmli = "<ul class='text-left'>";
      var lista = "";
      var htmlf = "</ul>";
      mensaje.forEach(function(item){
        lista = lista + "<li>"+item+"</li>";
      });
      htmli = htmli + lista + htmlf;
      Swal.fire({
        title: '<strong>CAMPOS INCOMPLETOS: </strong>',
        icon: 'warning',
        html: htmli,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      })
    }else{

    this.getDataPDF();
    this.employeeModel = JSON.parse(localStorage.getItem("currentUser"));
    this.userModel = JSON.parse(localStorage.getItem("currentUser"));
    const pdf = new PdfMakeWrapper();
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait');
    new Img('assets/img/logoPDF.png').width(100).style('tableHeader').build().then( img => {
      
      pdf.add(
        new Table([
          [ new Cell( img ).rowSpan(2).end, new Txt('Fecha: '+this.datePipe.transform(this.myDate,'dd-MM-yyyy') ).style('tableHeader').alignment("right").end],
          ['',new Txt('Nº. Cotización: '+ this.resume.Serie_Quotation).style('tableHeader').alignment("right").end]
          ]).layout('headerLineOnly').widths([ '*', '50%']).fontSize(8).end
      );

      pdf.add(
        new Canvas([
          new Line([515,0], [0, 0]).end
        ]).end
      );
      
      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [new Txt(this.companyPDF.Business_Name_Company).style('tableHeader').alignment("left").bold().end,
          new Txt('IT PROFESSIONAL CONSULTING SAC.').style('tableHeader').alignment("right").bold().end],
          [new Txt("R.U.C. "+this.companyPDF.Ruc_Company).alignment("left").end
          ,new Txt('R.U.C.      20601268206').alignment("right").end],
          [new Txt("Correo: "+this.clientPDF.Email_Client).alignment("left").end
          ,new Txt('Tel.           966391200').style('tableHeader').alignment("right").end],
          [new Txt("Tel.: "+this.clientPDF.Phone_Client).alignment("left").end,""],
          [new Txt("Att.: "+this.clientPDF.Name_Client+' '+this.clientPDF.Lastname_Client).alignment("left").end,""]
        ]).layout('headerLineOnly').widths([ '*', '50%']).fontSize(8).end
      );

      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Canvas([
          new Line([515,0], [0, 0]).end
        ]).end
      );
      
      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [{
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('ITEM').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('DESCRIPCION').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('MARCA').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('CANTIDAD').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('PART NUMBER').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('UNIDAD').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('P. UNITARIO').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('SUBTOTAL').fontSize(8).end,
          }
        ]
        ]).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).alignment("center").end
      );



      pdf.add(
        new Table(
          this.getDataPDF()
        ).widths("*").fontSize(8).layout({
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : '';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : '';
          }
        }).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).end
      );

      pdf.add(
        pdf.ln(1)
      );
      
      pdf.add(
        new Table([
          ["","",new Cell(new Txt("SUB TOTAL:").end,).colSpan(2).end,"","","","S/",this.getTotal()],
          [new Cell(new Txt("+IGV").end,).colSpan(8).end]
        ]).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).fontSize(10).alignment("right").layout("noBorders").bold().color('#509334').end
      );

      pdf.add(
        pdf.ln(1)
      );
      
      pdf.add(
        new Table([
          [new Txt("Atentamente").bold().end],
          [new Txt(this.employeeModel.Name_Employee + ' ' + this.employeeModel.Lastname_Employee).end],
          [new Txt(this.employeeModel.Area_Employee).end],
        ]).fontSize(8).widths("*").layout("noBorders").end
      );

      
      pdf.add(
        new Table([
          [new Txt(this.userModel.Email_User).end],
          [new Txt("Cel:" +this.employeeModel.Mobile_Employee).end]
        ]).fontSize(8).widths("*").layout({
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 1 : 0;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
          }
        }).end
      );

      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [new Txt("CONDICIONES COMERCIALES").bold().decoration("underline").end,""],
          [new Txt("Validez de la oferta").bold().end,this.resume.Validez_Quotation + " DÍAS CALENDARIO"],
          [new Txt("Forma de pago").bold().end,"A 30 DÍAS"],
          [new Txt("Precios ").bold().end,"LOS PRECIOS ESTÁN CONSIDERADOS EN SOLES Y NO INCLUYE IGV"]
        ]).fontSize(8).widths(["30%","70%"]).layout("noBorders").end
      );

      pdf.add(      
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          ["Contabilidad: Jessica.barreto@itgreen.com.pe "],
          ["Comercial: Jorge.lopez@itgreen.com.pe "],
          ["Depósito en soles al banco Interbank N° 165-3001232183"],
          ["Depósito en soles al banco Interbank CCI: 003-165-003001232183-89"],
          ["Depósito en soles al Banco de la Nacion - Detraccion - N° 00-048-018211"]
        ]).fontSize(8).widths("*").end
      );

      pdf.create().open();
    });

    }
    
  }

  descargarPDF(){

    var mensaje = [];
    if(this.resume.Area_Quotation === undefined){
      mensaje.push("Seleccione el área de la cotización");
    }
    if(this.resume.Service_Id == 0){
      mensaje.push("Seleccione el servicio");
    }
    if(this.resume.Company_Id === undefined){
      mensaje.push("Seleccione la empresa");
    }
    if(this.resume.Client_Id === undefined){
      mensaje.push("Seleccione el cliente");
    }
    if(this.resume.Title_Quotation === undefined){
      mensaje.push("Ingrese el título de la cotización");
    }
    if(this.resume.Validez_Quotation === undefined){
      mensaje.push("Ingrese la validez de la cotización");
    }

    this.resume.body.forEach(item => {
      if(item.Quantity_Cuerp === undefined){
        mensaje.push("Verifique las cantidades ingresadas.");
      }
    });
    if(mensaje.length > 0){
      var htmli = "<ul class='text-left'>";
      var lista = "";
      var htmlf = "</ul>";
      mensaje.forEach(function(item){
        lista = lista + "<li>"+item+"</li>";
      });
      htmli = htmli + lista + htmlf;
      Swal.fire({
        title: '<strong>CAMPOS INCOMPLETOS: </strong>',
        icon: 'warning',
        html: htmli,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      })
    }else{
    this.getDataPDF();
    this.employeeModel = JSON.parse(localStorage.getItem("currentUser"));
    this.userModel = JSON.parse(localStorage.getItem("currentUser"));
    const pdf = new PdfMakeWrapper();
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait');
    new Img('assets/img/logoPDF.png').width(100).style('tableHeader').build().then( img => {
      
      pdf.add(
        new Table([
          [ new Cell( img ).rowSpan(2).end, new Txt('Fecha: '+this.datePipe.transform(this.myDate,'dd-MM-yyyy') ).style('tableHeader').alignment("right").end],
          ['',new Txt('Nº. Cotización: '+ this.resume.Serie_Quotation).style('tableHeader').alignment("right").end]
          ]).layout('headerLineOnly').widths([ '*', '50%']).fontSize(8).end
      );

      pdf.add(
        new Canvas([
          new Line([515,0], [0, 0]).end
        ]).end
      );
      
      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [new Txt(this.companyPDF.Business_Name_Company).style('tableHeader').alignment("left").bold().end,
          new Txt('IT PROFESSIONAL CONSULTING SAC.').style('tableHeader').alignment("right").bold().end],
          [new Txt("R.U.C. "+this.companyPDF.Ruc_Company).alignment("left").end
          ,new Txt('R.U.C.      20601268206').alignment("right").end],
          [new Txt("Correo: "+this.clientPDF.Email_Client).alignment("left").end
          ,new Txt('Tel.           966391200').style('tableHeader').alignment("right").end],
          [new Txt("Tel.: "+this.clientPDF.Phone_Client).alignment("left").end,""],
          [new Txt("Att.: "+this.clientPDF.Name_Client+this.clientPDF.Lastname_Client).alignment("left").end,""]
        ]).layout('headerLineOnly').widths([ '*', '50%']).fontSize(8).end
      );

      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Canvas([
          new Line([515,0], [0, 0]).end
        ]).end
      );
      
      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [{
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('ITEM').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('DESCRIPCION').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('MARCA').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('CANTIDAD').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('PART NUMBER').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('UNIDAD').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('P. UNITARIO').fontSize(8).end,
          },
          {
            border: [true, true, true, false],
            fillColor: '#92D277',
            text: new Txt('SUBTOTAL').fontSize(8).end,
          }
        ]
        ]).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).alignment("center").end
      );



      pdf.add(
        new Table(
          this.getDataPDF()
        ).widths("*").fontSize(8).layout({
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : '';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : '';
          }
        }).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).end
      );

      pdf.add(
        pdf.ln(1)
      );
      
      pdf.add(
        new Table([
          ["","",new Cell(new Txt("SUB TOTAL:").end,).colSpan(2).end,"","","","S/",this.getTotal()],
          [new Cell(new Txt("+IGV").end,).colSpan(8).end]
        ]).widths(["5%","30%","10%","10%","15%","10%","10%","10%"]).fontSize(10).alignment("right").layout("noBorders").bold().color('#509334').end
      );

      pdf.add(
        pdf.ln(1)
      );
      
      pdf.add(
        new Table([
          [new Txt("Atentamente").bold().end],
          [new Txt(this.employeeModel.Name_Employee + ' ' + this.employeeModel.Lastname_Employee).end],
          [new Txt(this.employeeModel.Area_Employee).end],
        ]).fontSize(8).widths("*").layout("noBorders").end
      );

      
      pdf.add(
        new Table([
          [new Txt(this.userModel.Email_User).end],
          [new Txt("Cel:" +this.employeeModel.Mobile_Employee).end]
        ]).fontSize(8).widths("*").layout({
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 1 : 0;
          },
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
          }
        }).end
      );

      pdf.add(
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          [new Txt("CONDICIONES COMERCIALES").bold().decoration("underline").end,""],
          [new Txt("Validez de la oferta").bold().end,this.resume.Validez_Quotation + " DÍAS CALENDARIO"],
          [new Txt("Forma de pago").bold().end,"A 30 DÍAS"],
          [new Txt("Precios ").bold().end,"LOS PRECIOS ESTÁN CONSIDERADOS EN SOLES Y NO INCLUYE IGV"]
        ]).fontSize(8).widths(["30%","70%"]).layout("noBorders").end
      );

      pdf.add(      
        pdf.ln(1)
      );

      pdf.add(
        new Table([
          ["Contabilidad: Jessica.barreto@itgreen.com.pe "],
          ["Comercial: Jorge.lopez@itgreen.com.pe "],
          ["Depósito en soles al banco Interbank N° 165-3001232183"],
          ["Depósito en soles al banco Interbank CCI: 003-165-003001232183-89"],
          ["Depósito en soles al Banco de la Nacion - Detraccion - N° 00-048-018211"]
        ]).fontSize(8).widths("*").end
      );

      pdf.create().download(this.resume.Serie_Quotation);
    });
    }
  }

  createQuotation(){
    
    var mensaje = [];
    if(this.resume.Area_Quotation === undefined){
      mensaje.push("Seleccione el área de la cotización");
    }
    if(this.resume.Service_Id == 0){
      mensaje.push("Seleccione el servicio");
    }
    if(this.resume.Company_Id === undefined){
      mensaje.push("Seleccione la empresa");
    }
    if(this.resume.Client_Id === undefined){
      mensaje.push("Seleccione el cliente");
    }
    if(this.resume.Title_Quotation === undefined){
      mensaje.push("Ingrese el título de la cotización");
    }
    if(this.resume.Validez_Quotation === undefined){
      mensaje.push("Ingrese la validez de la cotización");
    }

    this.resume.body.forEach(item => {
      if(item.Quantity_Cuerp === undefined){
        mensaje.push("Verifique las cantidades ingresadas.");
      }
    });

    if(mensaje.length > 0){
      var htmli = "<ul class='text-left'>";
      var lista = "";
      var htmlf = "</ul>";
      mensaje.forEach(function(item){
        lista = lista + "<li>"+item+"</li>";
      });
      htmli = htmli + lista + htmlf;
      Swal.fire({
        title: '<strong>CAMPOS INCOMPLETOS: </strong>',
        icon: 'warning',
        html: htmli,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false
      })
    }else{
      this.userModel = JSON.parse(localStorage.getItem("currentUser"));
      this.resume.User_Id=this.userModel.IdMa_User;
      Swal.fire({
        title: 'Descargaste el PDF?',
        text: "No podra descargar el PDF mas adelante!!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, el PDF fue descargado !'
      }).then((result) => {
        if (result.value) {
          this.getDataPDF();
          this.getTotal();
          this.quotationService.createOrUpdateQuotation(this.resume).subscribe(
            res => {
              console.log(res);
              var string = JSON.stringify(res);
              var json = JSON.parse(string);
              if(json.affectedRows>0){
                Swal.fire({
                  title: 'Success',
                  text: `La cotización ${this.resume.Serie_Quotation} fue agregada` ,
                  icon: 'success'
                });
                this.router.navigate(['/quotations']);
              }else{
                Swal.fire({
                  title: 'error',
                  text: `Algo salio mal!!!` ,
                  icon: 'error'
                });
              }
            },
            err => console.error(err)
          );
        }
      })
    }
  }

}
