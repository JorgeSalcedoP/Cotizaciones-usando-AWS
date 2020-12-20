import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';

import {RoleService} from '../../services/role.service';
import { RoleModel } from 'src/app/models/role.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles : any = [];
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  permissions: any = [];
  page : number = 1;

  constructor(private roleService:RoleService) { }

  ngOnInit() {
    this.getRoles();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();
  }

  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'roles.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'roles.edit')){
      this.canEdits = true;
    }
  }

  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'roles.create')){
      this.canCreates = true;
    }
  }

  getRoles(){
    this.roleService.getRoles().subscribe(
      res =>{
        this.roles = res;
      },
      err => console.error(err)
    );
  }

  deleteRole(role:RoleModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al Rol  ${role.Name_Roles}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.roleService.deleteRole(role.IdMa_Roles).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `El rol ${role.Name_Roles} fue Eliminado` ,
              icon: 'success'
            });
            this.getRoles();
          },
          err => console.error(err)
        );
      }
    });  
  }

}
