import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable, from } from 'rxjs';

import {AuthenticatedService} from '../services/authenticated.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authenticate:AuthenticatedService){}

  canActivate(
    next:ActivatedRouteSnapshot,
    state:RouterStateSnapshot):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      if(this.authenticate.getCurrentUser()!= null){
        return true;
      }else{
        return false;
      }
    }
}
