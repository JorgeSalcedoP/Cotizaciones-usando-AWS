import { Component, OnInit } from '@angular/core';
import { AuthenticatedService } from '../../services/authenticated.service';
import { UserModel } from '../../models/user.model';
import { HomeService } from 'src/app/services/home.service';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  permissions: any = [];
  userVacio : UserModel;

  totalBillPendiente = 0;
  totalBillCerrado = 0;
  totalOrderProceso = 0;
  totalOrderFinalizado = 0
  totalQuotationAbierto = 0 ;
  totalQuotationPendiente = 0 ;
  totalQuotationAnulada = 0 ;
  totalQuotationRechazada = 0 ;
  totalQuotationAprobada = 0 ;

  canBillsShow:boolean = false;
  canOrdersShow:boolean = false;
  canQuotesShow:boolean = false;

  constructor(private authenticatedService: AuthenticatedService,private homeService: HomeService) { }

  ngOnInit() {
    this.getPermissions();
    this.getCounts();
  }

  getPermissions(){
    if(isNullOrUndefined(localStorage.getItem("permissionsByUser"))){
      this.userVacio = JSON.parse(localStorage.getItem("currentUser"));
      this.authenticatedService.getPermissions(this.userVacio.IdMa_User).subscribe(
        res=>{
          this.permissions = res;
          localStorage.setItem("permissionsByUser",JSON.stringify(this.permissions));
          this.getOptions();
        },
        err => console.error(err)
      );
    }else{
      this.permissions=JSON.parse(localStorage.getItem("permissionsByUser"));
      this.getOptions();
    }
  }

  getOptions(){
    if(this.permissions.find(item => item.Slug_Permissions === 'bills.index')){
      this.canBillsShow = true;
    };
    if(this.permissions.find(item => item.Slug_Permissions === 'orders.index')){
      this.canOrdersShow = true;
    };
    if(this.permissions.find(item => item.Slug_Permissions === 'quotation.index')){
      this.canQuotesShow = true;
    };
  }
  getCounts(){
    this.getTotalBills();
    this.getTotalOrders();
    this.getTotalQuotations();
  }

  getTotalBills(){
      this.homeService.getTotalBills().subscribe(
        res =>{
          this.totalBillPendiente=res[0].total;
          this.totalBillCerrado = res[1].total;
        },  
        err => console.error(err)
      );
  }

  getTotalOrders(){
    this.homeService.getTotalOrders().subscribe(
      res => {
        this.totalOrderProceso=res[0].total;
        this.totalOrderFinalizado = res[1].total;
      },
      err => console.error(err)
    );
  }

  getTotalQuotations(){
    this.homeService.getTotalQuotations().subscribe(
      res => {
        this.totalQuotationAbierto = res[0].total ;
        this.totalQuotationPendiente = res[1].total ;
        this.totalQuotationAnulada =  res[2].total;
        this.totalQuotationRechazada = res[3].total ;
        this.totalQuotationAprobada =  res[4].total;
      },
      err => console.error(err)
    );
  }

}
