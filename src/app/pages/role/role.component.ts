import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';

import { RoleModel } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { AuthenticatedService } from '../../services/authenticated.service';
import { FunctionService } from 'src/app/services/function.service';
import { element } from 'protractor';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  forma:FormGroup;

  isAllowed:boolean = false;
  edit:boolean = false;
  more: boolean = false ;

  role : RoleModel = {
    IdMa_Roles: 0,
    Name_Roles:'',
    Slug_Roles:'',
    Special_Roles:'',
    Creation_Roles: new Date(),
    Update_Roles: new Date(),
  }

  permissions: any = [];
  permissionsByRole: any =[];
  functionsByRole : any = [];
  functions : any = [];
  table : any = [];
  editFunctions : any = [];
  editPermissions : any = [];

  constructor(private functionService:FunctionService,private formBuilder: FormBuilder,private roleService:RoleService,private router:  Router,private activatedRoute:ActivatedRoute,private permissionService:PermissionService,private authenticatedService:AuthenticatedService) 
  { 
    this.forma = new FormGroup({
      Name_Roles: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
      Slug_Roles: new FormControl('',[Validators.required]),
      permissionsRole:new FormControl(''),
      functionsRole:new FormControl(''),
      Special_Roles:new FormControl('',[Validators.required])
    }); 
  }

  ngOnInit() {
    this.getPermissionsC();
    this.getFunctions();
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.roleService.getRole(param.id).subscribe(
        res => {
          this.role=res[0];
          this.edit=true;
          if(this.role.Special_Roles === 'allowed'){
            this.functionService.getFunctionsByRole(param.id).subscribe(
              res => {
                this.editFunctions = res;
                this.checkFunctions(this.editFunctions);
              }
            );
          }else if (this.role.Special_Roles === 'more'){
            this.permissionService.getPermissionsByRole(param.id).subscribe(
              res =>{
                this.editPermissions = res;
                this.checkPermissions(this.editPermissions);
              },
              err => console.error(err)
            );
          }
        },
        err => console.error(err)
      );
    }
  }

  checkFunctions(functionsArray){
    this.isAllowed = true;
    this.functions.forEach(functionItem => {
      functionsArray.forEach(item => {
        if(functionItem.IdMa_Function === item.Function_Id){
          functionItem.Checked_Function = 1;
          this.functionsByRole.push(functionItem.IdMa_Function);
        }
      });
    });
  }

  checkPermissions(permissionsArray){
    this.more = true;
    this.permissions.forEach(permissionItem => {
      permissionsArray.forEach(item => {
        if(permissionItem.IdMa_Permissions === item.permission_id){
          permissionItem.Checked_Permissions = 1;
          this.permissionsByRole.push(permissionItem.IdMa_Permissions);
        }
      });
    });
  }

  getPermissionsC(){
    this.permissionService.getPermissions().subscribe(
      res => {
        this.permissions=res;
      },
      err => console.error(err)
    );
  }

  getFunctions (){
    this.functionService.getFunctions().subscribe(
      res => {
        this.functions = res;
      },
      err => console.error(err)
    );
  }

  onCheckboxChange(option, event) {
    if(event.target.checked) {
      this.permissionsByRole.push(option.IdMa_Permissions);
    } else {
      for(var i=0 ; i < this.permissions.length; i++) {
        if(this.permissionsByRole[i] == option.IdMa_Permissions) {
          this.permissionsByRole.splice(i,1);
        }
      }
    }
  }

  onFunctionsChange(option, event) {
    if(event.target.checked) {
      this.functionsByRole.push(option.IdMa_Function);
    } else {
      for(var i=0 ; i < this.permissions.length; i++) {
        if(this.functionsByRole[i] == option.IdMa_Function) {
          this.functionsByRole.splice(i,1);
        }
      }
    }
  }

  updateRole(){
    this.roleService.createOrUpdateRole(this.role).subscribe(
      response =>{
        if(this.role.Special_Roles === 'all-access'){
          this.success(this.role);
        }else if(this.role.Special_Roles === 'no-access'){
          this.success(this.role);
        }else if (this.role.Special_Roles === 'more'){
          let data = [];
          this.permissionsByRole.forEach(element => {
            var per = {
              "role_id":this.role.IdMa_Roles,
              "permission_id":element
            }
            data.push(per);
          }); 
          this.permissionService.createOrUpdatePermission(data).subscribe(
            res => {
              this.success(this.role);
            },
            err => console.error(err)
          );
        }else{
          let table = [];
          this.functionsByRole.forEach(element => {
            let rows = this.permissions.filter(item => item.Function_Id === element );
            rows.forEach(item => {
              if(item.Sentence_Permissions != 'destroy'){
                var per = {
                  "role_id":this.role.IdMa_Roles,
                  "permission_id":item.IdMa_Permissions
                }
                table.push(per);
              }
            });
          });
      
          this.permissionService.createOrUpdatePermission(table).subscribe(
            res => {
              this.success(this.role);
            },
            err => console.error(err)
          );
        }
      },
      err => console.error(err)
    );
  }



  createRole(){
    this.roleService.createOrUpdateRole(this.role).subscribe(
      response=>{
        if(this.role.Special_Roles === 'all-access'){
          this.success(this.role);
        }else if(this.role.Special_Roles === 'no-access'){
          this.success(this.role);
        }else if (this.role.Special_Roles === 'more'){
          var resp = JSON.stringify(response,null,2);
          var json = JSON.parse(resp);
          let data = [];
          this.permissionsByRole.forEach(element => {
            var per = {
              "role_id":json.insertId,
              "permission_id":element
            }
            data.push(per);
          }); 
          this.permissionService.createOrUpdatePermission(data).subscribe(
            res => {
              var string=JSON.stringify(res);
              var json = JSON.parse(string);
              if(json.affectedRows > 0){
                this.success(this.role);
              }
            },
            err => console.error(err)
          );
        }else{
          var resp = JSON.stringify(response,null,2);
          var json = JSON.parse(resp);
          let table = [];
          this.functionsByRole.forEach(element => {
            let rows = this.permissions.filter(item => item.Function_Id === element );
            rows.forEach(item => {
              if(item.Sentence_Permissions != 'destroy'){
                var per = {
                  "role_id":json.insertId,
                  "permission_id":item.IdMa_Permissions
                }
                table.push(per);
              }
            });
          });
      
          this.permissionService.createOrUpdatePermission(table).subscribe(
            res => {
              var string=JSON.stringify(res);
              var json = JSON.parse(string);
              if(json.affectedRows > 0){
                this.success(this.role);
              }
            },
            err => console.error(err)
          );
        }
      },
      err => console.error(err)
    );
  }

  success(role:RoleModel){
    Swal.fire({
      title: 'Success',
      text: `El rol ${this.role.Name_Roles} fue procesado` ,
      icon: 'success'
    });
    this.router.navigate(['/roles']);
  }

  validatePermissions(){
    if(this.role.Special_Roles === 'allowed'){
      this.isAllowed = true;
      this.more = false;
    }else if (this.role.Special_Roles === 'more'){
      this.isAllowed = false;
      this.more = true;
    }else{
      this.isAllowed = false;
      this.more = false;
    }
  }


}
