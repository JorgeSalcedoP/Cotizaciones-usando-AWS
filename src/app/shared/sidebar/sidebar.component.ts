import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthenticatedService } from '../../services/authenticated.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {


  user:UserModel;

  userVacio : UserModel;

  permissions : any = [];
  res : Boolean;
  
  constructor(private authenticatedService: AuthenticatedService,private router:Router,private location: Location) { }

  ngOnInit() {
    this.user = this.authenticatedService.getCurrentUser();
    this.getPermissions();
  }

  logOut(){
    this.authenticatedService.logoutUser();
    this.router.navigate(['/login']);
  }

  getPermissions(){
     if(JSON.parse(localStorage.getItem("permissionsByUser")) === null){
        this.userVacio = JSON.parse(localStorage.getItem("currentUser"));
        this.authenticatedService.getPermissions(this.userVacio.IdMa_User).subscribe(
          res=>{
            this.permissions=res;
            localStorage.setItem("permissionsByUser",JSON.stringify(this.permissions));
          },
          err => console.error(err)
        );
     }else{
       this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
     }
  }


}
