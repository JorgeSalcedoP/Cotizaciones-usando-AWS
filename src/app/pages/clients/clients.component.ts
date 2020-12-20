import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


import { ClientModel } from '../../models/client.model';
import { ClientService } from '../../services/client.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  
  clients : any = [];
  permissions: any = [];
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  
  constructor(private clientService:ClientService,) { }

  ngOnInit() {
    this.getClients();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  getClients(){
    this.clientService.getClients().subscribe(
      res => {
        this.clients=res;
      },
      err => console.error(err)
    );
  }

  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'customers.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'customers.edit')){
      this.canEdits = true;
    }
  }

  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'customers.create')){
      this.canCreates = true;
    }
  }

  deleteClient(client:ClientModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar a el cliente  ${client.Name_Client}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.clientService.deleteClient(client.IdMa_Client).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `El cliente  ${client.Name_Client} fue Eliminado` ,
              icon: 'success'
            });
            this.getClients();
          },
          err => console.error(err)
        );
      }
    });
  }

}
