import { Component, OnInit } from '@angular/core';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import { OrdenCompraModel } from '../../models/ordenCompra.model';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthenticatedService } from 'src/app/services/authenticated.service';

@Component({
  selector: 'app-osces',
  templateUrl: './osces.component.html',
  styleUrls: ['./osces.component.css']
})
export class OscesComponent implements OnInit {

  osces: any = []; 
  permissions: any = [];

  userVacio : UserModel;
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  canCreateBill = false;

  constructor(private router:Router,private authenticatedService: AuthenticatedService,private ordenCompraService : OrdenCompraService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.getOsces();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  getOsces(){
    const param = this.activatedRoute.snapshot.params;
    if(isNullOrUndefined(param.status)){
      this.ordenCompraService.getOrders().subscribe(
        res => {
          console.log(res);
          this.osces=res;
        },
        err => console.error(err)
      );
    }else{
      if(param.status === 'Finalizado'){
        this.canCreateBills();
      }
      this.ordenCompraService.getOrdersByStatus(param.status).subscribe(
        res => {
          console.log(res);
          this.osces = res;
        },
        err => console.error(err)
      );
    }
  }


  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'orders.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'orders.edit')){
      this.canEdits = true;
    }
  } 
  
  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'orders.create')){
      this.canCreates = true;
    }
  }
  
  canCreateBills(){
    this.getPermissionsByUser();
    if(this.permissions.find(item => item.Slug_Permissions === 'bills.create')){
      this.canCreateBill = true;
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


  deleteOrder(order:OrdenCompraModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar la orden  ${order.Serie_Osce}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.ordenCompraService.deleteOrder(order.IdMa_Osce).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `La orden  ${order.Serie_Osce} fue Eliminada` ,
              icon: 'success'
            });
            this.getOsces();
          },
          err => console.error(err)
        );
      }
    });
  } 

  createBill(order:OrdenCompraModel){

    var json = {
      Osce_Serie:order.Serie_Osce,
      Quotation_Serie:order.Quotation_Serie,
      SRestante_Osce:order.Total_Osce,
      Moneda_Osce:order.Moneda_Osce,
      Company_Id:order.Company_Id,
      Service_Description:order.Service_Description
    }

    localStorage.setItem("Osce_Data",JSON.stringify(json));
    this.router.navigate(['/bill/nuevo']);


    
  }

}
