import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticatedService } from '../../services/authenticated.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(private authenticatedService:AuthenticatedService,private router:Router) { }

  ngOnInit() {
  }

  logOut(){
    this.authenticatedService.logoutUser();
    this.router.navigate(['/login']);
  }

}
