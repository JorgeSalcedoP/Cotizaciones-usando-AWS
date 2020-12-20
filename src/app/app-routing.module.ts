import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';

import { AuthGuard } from '../app/guard/auth.guard';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component';


const routes: Routes = [
  {path: '', loadChildren: './pages/pages.module#PagesModule'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forbidden', component: ForbiddenComponent},
  {path: '**', component: NotfoundComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
