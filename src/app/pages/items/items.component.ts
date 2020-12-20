import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ItemService } from '../../services/item.service';
import { ItemModel } from '../../models/item.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: any = []; 
  permissions: any = [];

  canDelete: boolean = false;
  canEdits:boolean = false;
  canCreates:boolean = false ;
  p:number = 1;
  
  constructor(private itemService:ItemService) { }

  ngOnInit() {
    this.getItems();
    this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
    this.canDestroy();
    this.canEdit();
    this.canCreate();    
  }

  getItems(){
    this.itemService.getItems().subscribe(
      res => {
        this.items=res;
      },
      err => console.error(err)
    ); 
}


canDestroy(){
  if(this.permissions.find(item => item.Slug_Permissions === 'items.destroy')){
    this.canDelete = true;
  }
}

canEdit(){
  if(this.permissions.find(item => item.Slug_Permissions === 'items.edit')){
    this.canEdits = true;
  }
}

canCreate(){
  if(this.permissions.find(item => item.Slug_Permissions === 'items.create')){
    this.canCreates = true;
  }
}


deleteItem(item:ItemModel){
  Swal.fire({
    title: '¿Esta seguro?',
    text: `Esta seguro de borrar item  ${item.Description_Item}`,
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true
  }).then(resp => {
    if (resp.value) {
      this.itemService.deleteItem(item.IdMa_Item).subscribe(
        res =>{
          Swal.fire({
            title: 'Eliminado',
            text: `El item ${item.Description_Item} fue Eliminado` ,
            icon: 'success'
          });
          this.getItems();
        },
        err => console.error(err)
      );
    }
  });
}


}