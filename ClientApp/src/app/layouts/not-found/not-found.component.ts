import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFound {
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  public redirectToHome() {
    this.router.navigate(['/']);
  }

}
