import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

import { EmployeeModel } from '../../models/employee.model';
import { UserModel } from '../../models/user.model';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from '../../services/user.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  forma:FormGroup;

  edit: boolean = false;

  userModel:UserModel={
    IdMa_User: 0,
    Name_User: '',
    Email_User:'',
    Password_User:'',
    Employee_Id:0,
    Roles_Id:0,
    Creation_User:new Date(),
    Updated_User:new Date(),
    Status_User: 'Deshabilitado'
  }

  employee: EmployeeModel = {
  IdMa_Employee: 0,
	Name_Employee: '',
	Lastname_Employee: '',
	Mobile_Employee: '',
	Email_Employee: '',
	Birthdate_Employee: new Date(),
	Area_Employee: '',
	Creation_Employee: new Date(),
	Update_Employee: new Date(),
	Status_Employee: true
};


  constructor(private employeeService: EmployeeService, private router: Router,private activatedRoute:ActivatedRoute,private userService:UserService) { 
  this.forma = new FormGroup({
    Name_Employee: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
    Lastname_Employee: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
    Mobile_Employee: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$')]),
    Email_Employee: new FormControl('',[Validators.required]),
    Birthdate_Employee: new FormControl('',[Validators.required]),
    Area_Employee: new FormControl('',[Validators.required])
  });
} 

  ngOnInit() {
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.employeeService.getEmployee(param.id).subscribe(
        res => {
          this.employee=res[0];
          this.edit=true;
        }, 
        err => console.error(err) 
        );   
  }

}

createEmployee(){
  this.employeeService.createOrUpdateEmployee(this.employee).subscribe(
    res =>{
      
      var string=JSON.stringify(res);
      var json = JSON.parse(string);
      if(json.insertId > 0){
        Swal.fire({
          title: 'Success',
          text: `El empleado ${this.employee.Name_Employee} fue agregado` ,
          icon: 'success'
        });
        this.router.navigate(['/employees']);
      }else{
        Swal.fire({
          title: 'Error',
          text: `Algo salio mal, El empleado no fue agregado..!!` ,
          icon: 'error'
        });
      }
        /*
        var name=this.employee.Name_Employee.split(" ");
        var firstName=name[0].toLowerCase();

        var lastName=this.employee.Lastname_Employee.split(" ");
        var firstLastName=lastName[0].toLowerCase();

        this.userModel.Name_User=this.employee.Name_Employee;
        this.userModel.Email_User=firstName+"."+firstLastName+"@itgreen.com.pe";
        this.userModel.Password_User="ItGreen2020";
        this.userModel.Employee_Id=json.insertId;
        this.userModel.Roles_Id=1;
        
        this.userService.createOrUpdateUser(this.userModel).subscribe(
          res=>{
            var string=JSON.stringify(res);
            var json = JSON.parse(string);
            if(json.insertId !=0){
              Swal.fire({
                title: 'Success',
                text: `El empleado ${this.employee.Name_Employee} fue agregado` ,
                icon: 'success'
              });
              this.router.navigate(['/employees']);
            }
          },
          err => console.error(err)
        );*//*
      }else{
        Swal.fire({
          title: 'Error',
          text: `Algo salio mal, El empleado no fue agregado..!!` ,
          icon: 'error'
        });
      }*/
    },
    err=> console.error(err)
  );
}

updateEmployee(){
  this.employee.Status_Employee=true;
  this.employeeService.createOrUpdateEmployee(this.employee).subscribe(
    res => {
      var string=JSON.stringify(res);
      var json = JSON.parse(string);
      if(json.affectedRows > 0){
        Swal.fire({
          title: 'Success',
          text: `El Empleado ${this.employee.Name_Employee} fue actualizado` ,
          icon: 'success'
        });
        this.router.navigate(['/employees']);
      }
    },
        err => console.error(err)
  );
}

}