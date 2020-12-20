import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrdFilterPipe} from '../pipes/grd-filter.pipe';
import { NoimagePipe } from '../pipes/noimage.pipe';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyComponent } from './company/company.component';
import { ClientComponent } from './client/client.component';
import { ClientsComponent } from './clients/clients.component';
import { RoleComponent } from './role/role.component';
import { RolesComponent } from './roles/roles.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeesComponent } from './employees/employees.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { BillComponent } from './bill/bill.component';
import { BillsComponent } from './bills/bills.component';
import { OsceComponent } from './osce/osce.component';
import { OscesComponent } from './osces/osces.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './item/item.component';
import { ServiceComponent } from './service/service.component';
import { ServicesComponent } from './services/services.component';
import { SearchComponent } from './search/search.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationsComponent } from './quotations/quotations.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { QuotationEditComponent } from './quotation-edit/quotation-edit.component';
import { ReportComponent } from './report/report.component';




@NgModule({
  declarations: [PagesComponent, HomeComponent, UsuarioComponent, UsuariosComponent, GrdFilterPipe, NoimagePipe, CompaniesComponent, CompanyComponent, ClientComponent, ClientsComponent, RoleComponent, RolesComponent, EmployeeComponent, EmployeesComponent, UserComponent, UsersComponent, BillComponent, BillsComponent, OsceComponent, OscesComponent, ItemsComponent, ItemComponent, ServiceComponent, ServicesComponent, SearchComponent, QuotationComponent, QuotationsComponent, QuotationEditComponent, ReportComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class PagesModule { }
