import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { from } from 'rxjs';
import { OrdenCompraModel } from 'src/app/models/ordenCompra.model';
import { QuotationModel } from 'src/app/models/Quotation.model';
import { BillModel } from 'src/app/models/bill.model';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchText:string;

  quotations : any = [];
  orders : any = [];
  bills : any = [];
  canView : boolean = false;

  constructor(private quotationService:QuotationService) { }

  ngOnInit() {
  }

  json:any = {
    "Document" : '',
    "Quotation_Serie":''
  }

  searchDocuments(){
    this.buscarCotizacion();
    this.buscarOrder();
    this.buscarBill();
  }

  buscarCotizacion(){
    this.json.Document = "Quotation";
    this.json.Quotation_Serie = this.searchText;
    this.quotationService.getQuotationBySerie(this.json).subscribe(
      res=>{
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        console.log(Object.keys(json).length);
        if(Object.keys(json).length > 0){
          this.canView = true;
          this.quotations = res;
        }else{
          this.canView = false;
          this.quotations = [];
          Swal.fire({
            title: 'Error',
            text: `No se encontraron resultados...!!` ,
            icon: 'error'
          });
        }
      },
      err => console.error(err)
    );
  }

  buscarOrder(){
    this.json.Document = "Order";
    this.json.Quotation_Serie = this.searchText;
    this.quotationService.getQuotationBySerie(this.json).subscribe(
      res=>{
        this.orders=res;
      },
      err => console.error(err)
    );
  }

  buscarBill(){
    this.json.Document = "Bill";
    this.json.Quotation_Serie = this.searchText;
    this.quotationService.getQuotationBySerie(this.json).subscribe(
      res=>{
        this.bills = res;
      },
      err => console.error(err)
    );
  }

}
