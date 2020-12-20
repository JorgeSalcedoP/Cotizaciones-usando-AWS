import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthenticatedService} from '../services/authenticated.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { EmployeeModel } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { UserModel } from '../models/user.model';
import { PermissionsModel } from '../models/Permissions.model';

declare function init_extensions();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forma : FormGroup;

  permissions :any =[];

  constructor(private authenticatedService:AuthenticatedService, private router:Router, private employeeService:EmployeeService) { 
    this.forma = new FormGroup({
      Email_user: new FormControl('',[Validators.required]),
      Password_User: new FormControl('',[Validators.required]),
    });
  }

  user : UserModel = {
    IdMa_User: 0,
    Name_User: '',
    Email_User:'',
    Password_User:'',
    Employee_Id:0,
    Roles_Id:0,
    Status_User:'Habilitado',
    Creation_User:new Date(),
    Updated_User:new Date()
  }

  isError:boolean;

  ngOnInit() {
    init_extensions();
  }



  getConection(){
    
    return this.authenticatedService.getConnection(this.user).subscribe(
        data => {
          if(data[0] != undefined){
            if(data[0].Status_User === 'Habilitado'){
              this.authenticatedService.setUser(data[0]);
              this.getPermissions(data[0].IdMa_User);
              const token = data[0].IdMa_User;
              this.authenticatedService.setToken(token);
              this.router.navigate(['/home']);
              this.isError = false;
            }else{
              this.isError=true;
            }
          }else{
            this.isError=true;
          }
        },
        error => {
          console.error(error);
          this.isError=true;
        }
    );
  }

  getPermissions(idUser:Number){
    this.authenticatedService.getPermissions(idUser).subscribe(
      res=>{
        localStorage.setItem("permissionsByUser",JSON.stringify(res));
      },
      err => console.error(err)
    );
  }

} 

