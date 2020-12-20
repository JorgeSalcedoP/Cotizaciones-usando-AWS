import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { ClientComponent } from './client/client.component';
import { ClientsComponent } from './clients/clients.component';
import { RoleComponent } from './role/role.component';
import { RolesComponent } from './roles/roles.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employee/employee.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { BillComponent } from './bill/bill.component';
import { BillsComponent } from './bills/bills.component';
import { OsceComponent } from './osce/osce.component';
import { OscesComponent } from './osces/osces.component';
import { ServicesComponent } from './services/services.component';
import { ServiceComponent } from './service/service.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './item/item.component';
import { SearchComponent } from './search/search.component';
import { QuotationEditComponent } from './quotation-edit/quotation-edit.component';
import { QuotationsComponent } from './quotations/quotations.component';

import {AuthGuard} from '../guard/auth.guard';
import {HavePermissionsGuard} from '../guard/have-permissions.guard';
import { from } from 'rxjs';
import { QuotationComponent } from './quotation/quotation.component';
import { ForbiddenComponent } from '../shared/forbidden/forbidden.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'home', component: HomeComponent, data: {titulo: 'Home'},canActivate:[AuthGuard]},
      {path: 'companies',component: CompaniesComponent, data: {titulo: 'Empresas',permission:'companies.index' },canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'company/:id',component: CompanyComponent, data: {titulo: 'Empresa',permission:'companies.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'client/:id',component:ClientComponent,data:{titulo: 'Cliente',permission:'customers.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'clients',component:ClientsComponent,data:{titulo: 'Clientes',permission:'customers.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'roles',component: RolesComponent, data: {titulo: 'Roles',permission:'roles.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'role/:id',component: RoleComponent, data: {titulo: 'Role',permission:'roles.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'employee/:id',component:EmployeeComponent,data:{titulo: 'Empleado',permission:'employees.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'employees',component:EmployeesComponent,data:{titulo: 'Empleados',permission:'employees.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'user/:id',component:UserComponent,data:{titulo: 'Usuario',permission:'users.edit'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'users',component:UsersComponent,data:{titulo: 'Usuarios',permission:'users.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'bill/:id',component:BillComponent,data:{titulo: 'Factura',permission:'bills.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'bills',component:BillsComponent,data:{titulo: 'Facturas',permission:'bills.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'bills/:status',component:BillsComponent,data:{titulo: 'Facturas',permission:'bills.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'osce/:id',component:OsceComponent,data:{titulo: 'Orden de Compra',permission:'orders.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'osces',component:OscesComponent,data:{titulo: 'Ordenes de Compra',permission:'orders.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'osces/:status',component:OscesComponent,data:{titulo: 'Ordenes de Compra',permission:'orders.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'service/:id',component:ServiceComponent,data:{titulo: 'Servicio',permission:'services.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'services',component:ServicesComponent,data:{titulo: 'Servicios',permission:'services.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'item/:id',component:ItemComponent,data:{titulo: 'item',permission:'items.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'items',component:ItemsComponent,data:{titulo: 'items',permission:'items.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'search',component:SearchComponent,data:{titulo: 'Buscar',permission:'quotation.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'quotation/:id',component:QuotationEditComponent,data:{titulo: 'Cotización',permission:'quotation.create'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'quotation',component:QuotationComponent,data:{titulo: 'Cotización',permission:'quotation.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'quotations',component:QuotationsComponent,data:{titulo: 'Cotizaciones',permission:'quotation.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'quotations/:status',component:QuotationsComponent,data:{titulo: 'Cotizaciones',permission:'quotation.index'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'report',component:ReportComponent,data:{titulo: 'Reporte General',permission:'report.show'},canActivate:[AuthGuard,HavePermissionsGuard]},
      {path: 'forbidden', redirectTo: '/forbidden', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
