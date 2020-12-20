import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = []; 
  permissions: any = [];
  
  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  
  constructor(private userService:UserService) { } 


  ngOnInit() {
    this.getUsers();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate(); 
  }

  getUsers(){
    this.userService.getUsers().subscribe(
      res => {
        console.log(res);
        this.users=res;
      },
      err => console.error(err)
    );
  }

  canDestroy(){
    if(this.users.find(item => item.Slug_Permissions === 'users.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.users.find(item => item.Slug_Permissions === 'users.edit')){
      this.canEdits = true;
    }
  } 
  
  canCreate(){
    if(this.users.find(item => item.Slug_Permissions === 'users.create')){
      this.canCreates = true;
    }
  }  
  deleteUser(user:UserModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al usuario  ${user.Name_User}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.userService.deleteUser(user.IdMa_User).subscribe(
          res =>{
            console.error(res);
            Swal.fire({
              title: 'Eliminado',
              text: `El usuario ${user.Name_User} fue Eliminado` ,
              icon: 'success'
            });
            this.getUsers();
          },
          err => console.error(err)
        );
      }
    });
  } 



}