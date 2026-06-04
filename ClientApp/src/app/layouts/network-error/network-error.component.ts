import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-network-error.component',
  imports: [],
  templateUrl: './network-error.component.html',
  styleUrl: './network-error.component.css',
})
export class NetworkError {
  constructor(private router: Router) {}

  reloadPage() {
  window.location.reload();
}

goHome() {
  this.router.navigate(['/']);
}
}
