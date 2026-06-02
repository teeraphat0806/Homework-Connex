import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forbidden',
  imports: [],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {
  constructor(private router: Router) { }

  public redirectToHome() {
    this.router.navigate(['/']);
  }
}
