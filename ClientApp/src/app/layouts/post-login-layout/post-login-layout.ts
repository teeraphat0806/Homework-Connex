import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostloginNavbarComponent } from './components/postlogin-navbar.component/postlogin-navbar.component';

@Component({
  selector: 'app-post-login-layout',
  imports: [CommonModule, RouterOutlet, PostloginNavbarComponent],
  templateUrl: './post-login-layout.html',
  styleUrl: './post-login-layout.css',
})
export class PostLoginLayout {}
