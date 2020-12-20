import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';


import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  forma:FormGroup;
  roles: any = [];

  edit: boolean = false;

  user: UserModel = {
  IdMa_User: 0,
  Name_User: '',
  Email_User: '',
  Password_User:'',
  Employee_Id:0,
  Roles_Id:0,
  Creation_User: new Date(),
  Updated_User: new Date(),
  Status_User: 'Habilitado'
};



  constructor(private userService: UserService, private router: Router,private activatedRoute:ActivatedRoute,private roleService:RoleService) {
    this.forma = new FormGroup({
      Name_User: new FormControl('',[Validators.required]),
      Email_User: new FormControl('',[Validators.required]),
      Password_User: new FormControl('',[Validators.required]),
      Roles_Id: new FormControl('',[Validators.required]),
      Status_User: new FormControl('',[Validators.required]),
    });
   }

  ngOnInit() {
    this.getRoles();
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.userService.getUser(param.id).subscribe(
        res => {
          this.user=res[0];
          this.edit=true;
        },
        err => console.error(err)
      );
    }
}

getRoles(){
  this.roleService.getRoles().subscribe(
    res=>{
      this.roles=res;
    },
    err => console.error(err)
  );
}

createUser(){
  this.userService.createOrUpdateUser(this.user).subscribe(
    res =>{
      if(!isNullOrUndefined(res)){
        Swal.fire({
          title: 'Success',
          text: `El usuario ${this.user.Name_User} fue agregado` ,
          icon: 'success'
        });
        this.router.navigate(['/users']);
      }else{
        Swal.fire({
          title: 'Error',
          text: `Algo salio mal, El usuario no fue agregado..!!` ,
          icon: 'error'
        });
      }
    },
    err=> console.error(err)
  );
}

updateUser(){
  this.userService.createOrUpdateUser(this.user).subscribe(
    res => {
      var string = JSON.stringify(res);
      var  json = JSON.parse(string);
      if(json.affectedRows >0){

        Swal.fire({
          title: 'Success',
          text: `El usuario ${this.user.Name_User} fue actualizado` ,
          icon: 'success'
        });
        this.router.navigate(['/users']);
      }
    },
        err => console.error(err)
  );
}

}