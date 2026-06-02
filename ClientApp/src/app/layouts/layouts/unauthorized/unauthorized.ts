import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/modules/shared/interceptors/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  
  constructor(
    private router: Router,
    // private auth: AuthService
  ) { }

  ngOnInit() {
  }

  public redirectToLogin() {
    // this.auth.logout();
  }

}
