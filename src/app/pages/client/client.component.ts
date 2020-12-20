import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2';


import { ClientModel } from '../../models/client.model';
import { CompanyService } from '../../services/company.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  forma:FormGroup;

  edit:boolean = false;

  client : ClientModel = {
    IdMa_Client: 0,
    Name_Client:'',
    Lastname_Client:'',
    Area_Client:'',
    Phone_Client:'',
    Mobile_Client:'',
    Email_Client:'',
    Company_Id:0,
    Creation_Client:new Date(),
    Update_Client:new Date(),
    Status_Client:true,
  }

  companies: any = [];

  constructor(private companyService:CompanyService,private clientService:ClientService,private router:  Router,private activatedRoute:ActivatedRoute) 
  { 
    this.forma = new FormGroup({
      Name_Client: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
      Lastname_Client: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-ZñÑÁÉÍÓÚáéíóú ]+$')]),
      Area_Client: new FormControl('',[Validators.required]),
      Phone_Client: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$')]),
      Mobile_Client: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$')]),
      Email_Client: new FormControl('',[Validators.required,Validators.email]),
      Company_Id: new FormControl('')
    });  
  }

  ngOnInit() {
    /*if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }*/
    this.getCompanies();
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.clientService.getClient(param.id).subscribe(
        res => {
          this.client=res[0];
          this.edit=true;
        },
        err => console.error(err)
      );
    }
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(
      res => {
        this.companies = res;
      },
      err => console.error(err)
    );
  }

  createClient(){
    this.clientService.createOrUpdateClient(this.client).subscribe(
      res => {
        var string=JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.insertId > 0){
          Swal.fire({
            title: 'Success',
            text: `El cliente ${this.client.Name_Client} fue agregado` ,
            icon: 'success'
          });
          this.router.navigate(['/clients']);
        }else{
          Swal.fire({
            title: 'Error',
            text: `Algo salio mal, El cliente no fue agregado..!!` ,
            icon: 'error'
          });
        }
      },
      err => console.error(err)
    );
  }

  updateClient(){
    this.clientService.createOrUpdateClient(this.client).subscribe(
      res => {
        var string=JSON.stringify(res);
        var json = JSON.parse(string);
        if(json.affectedRows > 0){
          Swal.fire({
            title: 'Success',
            text: `El cliente ${this.client.Name_Client} fue actualizado` ,
            icon: 'success'
          });
          this.router.navigate(['/clients']);
        }
      },
          err => console.error(err)
    );
  }
  

}
