import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees: any = []; 
  permissions: any = [];

  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  
  constructor(private employeeService:EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate(); 
  }

  getEmployees(){
    this.employeeService.getEmployees().subscribe(
      res => {
        this.employees=res;
      },
      err => console.error(err)
    );
  }


  canDestroy(){
    if(this.permissions.find(item => item.Slug_Permissions === 'employees.destroy')){
      this.canDelete = true;
    }
  }

  canEdit(){
    if(this.permissions.find(item => item.Slug_Permissions === 'employees.edit')){
      this.canEdits = true;
    }
  } 
  
  canCreate(){
    if(this.permissions.find(item => item.Slug_Permissions === 'employees.create')){
      this.canCreates = true;
    }
  }  


  deleteEmployee(employee:EmployeeModel){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al empleado  ${employee.Name_Employee}`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.employeeService.deleteEmployee(employee.IdMa_Employee).subscribe(
          res =>{
            Swal.fire({
              title: 'Eliminado',
              text: `El usuario ${employee.Name_Employee} fue Eliminado` ,
              icon: 'success'
            });
            this.getEmployees();
          },
          err => console.error(err)
        );
      }
    });
  } 
  
}