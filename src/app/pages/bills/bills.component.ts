import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { BillModel } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  bills : any = [];
  permissions: any = [];
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  total : Number = 0;
  showTotal:boolean = false;
  p:number = 1;
  
  constructor(private billService : BillService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.getBills();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  getBills(){
    const param = this.activatedRoute.snapshot.params;
    if(isNullOrUndefined(param.status)){
      this.billService.getBills().subscribe(
        res => {
          this.bills=res;
        },
        err => console.error(err)
      );
    }else{
      this.billService.getBillsByStatus(param.status).subscribe(
        res => {
          this.bills = res;
          if(param.status === 'Pendiente'){
            this.showTotal = true;
            this.getTotalOfBills();
            this.canCreates = false;
          }
        },
        err => console.error(err)
      );
    }
    
  }

  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'bills.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'bills.edit')){
      this.canEdits = true;
    }
  }

  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'bills.create')){
      this.canCreates = true;
    }else{
      this.canCreates = false;
    }
  }

  deleteBill(bill:BillModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar la factura  ${bill.Serie_Bill}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.billService.deleteBill(bill.IdMa_Bill).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `La factura  ${bill.Serie_Bill} fue Eliminada` ,
              icon: 'success'
            });
            this.getBills();
          },
          err => console.error(err)
        );
      }
    });
  }

  getTotalOfBills(){
    let pendientes = this.bills.filter(item => item.Status_Bill === 'Pendiente');
    pendientes.forEach(element => {
      this.total = this.total + element.Total_Bill;
    });
  }

}
