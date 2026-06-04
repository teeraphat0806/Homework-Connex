import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-pre-login-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './pre-login-layout.html',
  styleUrl: './pre-login-layout.css',
})
export class PreLoginLayout {}
