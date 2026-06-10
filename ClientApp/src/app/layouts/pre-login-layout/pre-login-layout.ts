import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {PreloginNavbarComponent} from './components/prelogin-navbar.component/prelogin-navbar.component';
@Component({
  selector: 'app-pre-login-layout',
  imports: [CommonModule, RouterOutlet, PreloginNavbarComponent],
  templateUrl: './pre-login-layout.html',
  styleUrl: './pre-login-layout.css',
})
export class PreLoginLayout {}
