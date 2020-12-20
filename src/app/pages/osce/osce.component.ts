import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';

import { OrdenCompraModel } from '../../models/ordenCompra.model';
import { OrdenCompraService } from '../../services/orden-compra.service';
import { CompanyService } from 'src/app/services/company.service';

declare function init_extensions();

@Component({
  selector: 'app-osce',
  templateUrl: './osce.component.html',
  styleUrls: ['./osce.component.css']
})
export class OsceComponent implements OnInit {

  selectedOC: FileList;
  selectedDocument: FileList;
  readersOC: string | ArrayBuffer;
  readersDocument: string | ArrayBuffer;
  forma: FormGroup;
  edit: boolean = false;
  urls: any = [];
  companies: any = [];


  oc: OrdenCompraModel = {
    IdMa_Osce: 0,
    Serie_Osce: '',
    Quotation_Serie: '',
    Service_Description: '',
    Moneda_Osce: '',
    PSubtotal_Osce: 0,
    SRestante_Osce: 0,
    Total_Osce: 0,
    Commentary_Osce: '',
    Status_Osce: '',
    Document_Osce: '',
    Files_Osce: '',
    Creation_Osce: new Date(),
    Update_Osce: new Date(),
    Files: 0,
    Document: 0,
    Company_Id: 0
  }

  constructor(private companyService: CompanyService, private ordenCompraService: OrdenCompraService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.forma = new FormGroup({
      Serie_Osce: new FormControl('', [Validators.required]),
      PSubtotal_Osce: new FormControl('', [Validators.required]),
      Total_Osce: new FormControl('', [Validators.required]),
      SRestante_Osce: new FormControl('', [Validators.required]),
      File_Osce: new FormControl(''),
      Files_Osce: new FormControl(''),
      File_Documents: new FormControl(''),
      Document_Osce: new FormControl(''),
      Commentary_Osce: new FormControl('', [Validators.required]),
      Quotation_Serie: new FormControl('', [Validators.required]),
      Status_Osce: new FormControl('', [Validators.required]),
      Moneda_Osce: new FormControl('', [Validators.required]),
      Company_Id: new FormControl('', [Validators.required]),
      Service_Description: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    init_extensions();
    var Quotation = JSON.parse(localStorage.getItem("Quotation_Data"));
    if (Quotation != undefined) {
      this.oc.Quotation_Serie = Quotation.Serie_Quotation;
      this.oc.SRestante_Osce = Quotation.SRestante_Quotation;
      this.oc.PSubtotal_Osce = Quotation.Total_Quotation;
      this.oc.Moneda_Osce = 'Soles';
      this.oc.Status_Osce = 'Proceso';
      this.oc.Service_Description = Quotation.service_Description;
      this.oc.Total_Osce = (+this.oc.PSubtotal_Osce * 1.18);
      this.oc.Company_Id = Quotation.Company_Id;
      localStorage.removeItem("Quotation_Data");
    }
    this.getCompanies();
    const param = this.activatedRoute.snapshot.params;
    if (param.id != "nuevo") {
      this.ordenCompraService.getOrder(param.id).subscribe(
        res => {
          this.oc = res[0];
          this.edit = true;
        },
        err => console.error(err)
      );
    }
  }

  getCompanies() {
    this.companyService.getCompanies().subscribe(
      res => {
        this.companies = res;
      },
      err => console.error(err)
    );
  }

  createOrder() {
    if (this.forma.value.File_Osce != '' && this.forma.value.File_Documents === '') {
      const file = this.selectedOC.item(0);
      var data = {
        file: this.readersOC,
        name: file.name,
        type: file.type,
        folder:"oc"
      }
      this.ordenCompraService.postFile(data).subscribe(
        res => {
          var string = JSON.stringify(res);
          var json = JSON.parse(string);
          this.oc.Document_Osce = json.Location;
          this.saveOrder(this.oc);
        },
        err => console.error(err)
      );
    } else if (this.forma.value.File_Osce === '' && this.forma.value.File_Documents != '') {
      const file = this.selectedDocument.item(0);
      var data = {
        file: this.readersDocument,
        name: file.name,
        type: file.type,
        folder:"documento"
      }
      this.ordenCompraService.postFile(data).subscribe(
        res => {
          var string = JSON.stringify(res);
          var json = JSON.parse(string);
          this.oc.Files_Osce = json.Location;
          this.saveOrder(this.oc);
        },
        err => console.error(err)
      );
    } else if (this.forma.value.File_Osce != '' && this.forma.value.File_Documents != '') {
      let table = [];
      const orden = this.selectedOC.item(0);
      var oc = {
        file: this.readersOC,
        name: orden.name,
        type: orden.type,
        folder:"oc"
      }
      table.push(oc);
      const file = this.selectedDocument.item(0);
      var data = {
        file: this.readersDocument,
        name: file.name,
        type: file.type,
        folder:"documento"
      }
      table.push(data);
      this.ordenCompraService.postFiles(table).subscribe(
        res => {
          this.oc.Document_Osce = 'https://itpmupdatefiles.s3.amazonaws.com/oc/' + oc.name;
          this.oc.Files_Osce = 'https://itpmupdatefiles.s3.amazonaws.com/documento/' + data.name;
          this.saveOrder(this.oc)
        },
        err => console.error(err)
      );

    } else {
      this.saveOrder(this.oc);
    }
  }

  saveOrder(ordenCompra: OrdenCompraModel) {

    ordenCompra.Total_Osce = +ordenCompra.PSubtotal_Osce * 1;
    
    this.ordenCompraService.createOrUpdateOrder(ordenCompra).subscribe(
      res => {
        console.log(res);
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if (json.affectedRows > 0) {
          Swal.fire({
            title: 'Success',
            text: `La orden de compra ${ordenCompra.Serie_Osce} fue agregada`,
            icon: 'success'
          });
          this.router.navigate(['/osces']);
        } else {
          Swal.fire({
            title: 'Error',
            text: `Algo salio mal, La orden de compra no fue agregada..!!`,
            icon: 'error'
          });
        }
      },
      err => console.error(err)
    );
  }

  updateOrder() {
    if (this.oc.Document === 1 && this.oc.Files === 0) {
      const file = this.selectedOC.item(0);
      var data = {
        file: this.readersOC,
        name: file.name,
        type: file.type,
        folder:"oc"
      }
      this.ordenCompraService.postFile(data).subscribe(
        res => {
          var string = JSON.stringify(res);
          var json = JSON.parse(string);
          this.oc.Document_Osce = json.Location;
          this.update(this.oc);
        },
        err => console.error(err)
      );
    } else if (this.oc.Document === 0 && this.oc.Files === 1) {
      const file = this.selectedDocument.item(0);
      var data = {
        file: this.readersDocument,
        name: file.name,
        type: file.type,
        folder:"documento"
      }
      this.ordenCompraService.postFile(data).subscribe(
        res => {
          var string = JSON.stringify(res);
          var json = JSON.parse(string);
          this.oc.Files_Osce = json.Location;
          this.update(this.oc);
        },
        err => console.error(err)
      );
    } else if (this.oc.Document === 1 && this.oc.Files === 1) {
      let table = [];
      const orden = this.selectedOC.item(0);
      var oc = {
        file: this.readersOC,
        name: orden.name,
        type: orden.type,
        folder:"oc"
      }
      table.push(oc);
      const file = this.selectedDocument.item(0);
      var data = {
        file: this.readersDocument,
        name: file.name,
        type: file.type,
        folder:"documento"
      }
      table.push(data);
      this.ordenCompraService.postFiles(table).subscribe(
        res => {
          this.oc.Document_Osce = 'https://itpmupdatefiles.s3.amazonaws.com/oc/' + oc.name;
          this.oc.Files_Osce = 'https://itpmupdatefiles.s3.amazonaws.com/documento/' + data.name;
          this.update(this.oc)
        },
        err => console.error(err)
      );
    } else {
      this.update(this.oc);
    }
  }

  update(ordenCompra: OrdenCompraModel) {
    this.ordenCompraService.createOrUpdateOrder(ordenCompra).subscribe(
      res => {
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        if (json.affectedRows > 0) {
          Swal.fire({
            title: 'Success',
            text: `La Orden ${ordenCompra.Serie_Osce} fue actualizada`,
            icon: 'success'
          });
          this.router.navigate(['/osces']);
        }
      },
      err => console.error(err)
    );
  }

  selectFile(event) {
    this.selectedOC = event.target.files;
    this.oc.Document = 1;
    console.log(this.selectedOC)
    const file1 = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file1);
    reader.onload = () => {
      this.readersOC = reader.result;
    };
  }

  selectDocument(event) {
    this.oc.Files = 1;
    this.selectedDocument = event.target.files;
    const file1 = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file1);
    reader.onload = () => {
      this.readersDocument = reader.result;
    };
  }

  getDolar() {
    if (this.oc.Moneda_Osce === 'Dolares') {
      this.oc.PSubtotal_Osce = 0;
      this.oc.Total_Osce = 0;
      this.oc.SRestante_Osce = 0;
    }
  }

}
