import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

import { ItemModel } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { ServiceService }  from '../../services/service.service';
import { isNullOrUndefined } from 'util';
import { from } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  forma:FormGroup;

  edit: boolean = false;

  services: any = [];

  item: ItemModel = {
    IdMa_Item: 0,
    Description_Item: '',
    Brand_Item: '',
    Partnumber_Item: 0,
    Unit_Item: '',
    PUnitary_Item:0,
    Creation_Item: new Date(),
    Update_Item: new Date(),
    Status_Item: true,
    Service_Id:0,
  };

  

  constructor(private itemService: ItemService, private router:  Router,private activatedRoute:ActivatedRoute,private serviceService:ServiceService) { 
  this.forma = new FormGroup({
    Description_Item: new FormControl('',[Validators.required]),
    Brand_Item: new FormControl(''),
    Partnumber_Item: new FormControl(''),
    Unit_Item: new FormControl(''),
    PUnitary_Item: new FormControl('',[Validators.required]),
    Service_Id: new FormControl('',[Validators.required])   
  });
}     
    
  ngOnInit() {
    this.getServices();
    const param = this.activatedRoute.snapshot.params;
    if(param.id != "nuevo"){
      this.itemService.getItem(param.id).subscribe(
        res => {
          this.item=res[0];
          this.edit=true;
        }, 
        err => console.error(err) 
        );    
  }

}

getServices(){
  this.serviceService.getServices().subscribe(
    res => {
      this.services = res;
    },
    err => console.error(err)
  );
}

createItem(){
  this.itemService.createOrUpdateItem(this.item).subscribe(
    res =>{
      var string=JSON.stringify(res);
      var json = JSON.parse(string);
      if(json.affectedRows > 0){
        Swal.fire({
          title: 'Success',
          text: `El Item ${this.item.Description_Item} fue agregado` ,
          icon: 'success'
        });
        this.router.navigate(['/items']);
      }else{
        Swal.fire({
          title: 'Error',
          text: `Algo salio mal, El item no fue agregado..!!` ,
          icon: 'error'
        });
      }
    },
    err=> console.error(err)
  );
}

updateItem(){

  this.item.Status_Item = true;
  
  this.itemService.createOrUpdateItem(this.item).subscribe(
    res => {
      var string=JSON.stringify(res);
      var json = JSON.parse(string);
      if(json.affectedRows > 0){
        Swal.fire({
          title: 'Success',
          text: `El Item ${this.item.Description_Item} fue actualizado` ,
          icon: 'success'
        });
        this.router.navigate(['/items']);
      }
    },
        err => console.error(err)
  );
}

}