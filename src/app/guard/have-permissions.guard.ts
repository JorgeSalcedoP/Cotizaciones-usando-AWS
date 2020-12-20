import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HavePermissionsGuard implements CanActivate {
  constructor(private router:Router){}

  canActivate(
    next:ActivatedRouteSnapshot,
    state:RouterStateSnapshot):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      let permissions = JSON.parse(localStorage.getItem("permissionsByUser"));
      
      let per = next.data.permission;
      if(permissions.find(item => item.Slug_Permissions === per)){
        return true;
      }else{
        this.router.navigate(['/forbidden']);
        return false;
      }
    }
}
