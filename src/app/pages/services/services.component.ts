import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ServiceService } from '../../services/service.service';
import { ServiceModel } from '../../models/service.model';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  services: any = []; 
  permissions: any = [];

  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;  
  p:number = 1;
  
  constructor(private serviceService:ServiceService) { }

  ngOnInit() {
    this.getServices();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();    
  }

  getServices(){
    this.serviceService.getServices().subscribe(
      res => {
        this.services=res;
      },
      err => console.error(err)
    );     
}


canDestroy(){
  if(this.permissions.find(item => item.Slug_Permissions === 'services.destroy')){
    this.canDelete = true;
  }
}

canEdit(){
  if(this.permissions.find(item => item.Slug_Permissions === 'services.edit')){
    this.canEdits = true;
  }
}

canCreate(){
  if(this.permissions.find(item => item.Slug_Permissions === 'services.create')){
    this.canCreates = true;
  }
}


deleteService(service:ServiceModel){
  Swal.fire({
    title: '¿Esta seguro?',
    text: `Esta seguro de borrar el servicio  ${service.Description_Service}`,
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true
  }).then(resp => {
    if (resp.value) {
      this.serviceService.deleteService(service.IdMa_Service).subscribe(
        res =>{
          Swal.fire({
            title: 'Eliminado',
            text: `El servicio ${service.Description_Service} fue Eliminado` ,
            icon: 'success'
          });
          this.getServices();
        },
        err => console.error(err)
      );
    }
  });
}
}