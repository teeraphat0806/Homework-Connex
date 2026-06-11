import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PreLoginNavbarService } from '../../services/navbar.service';
import { AuthApiService } from '../../../../modules/authentication/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarItemModel } from '../../models/navbar.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prelogin-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './prelogin-navbar.component.html',
  styleUrl: './prelogin-navbar.component.css',
})
export class PreloginNavbarComponent {
  public navItems: NavbarItemModel[] = [];
  private preLoginNavbarService = inject(PreLoginNavbarService);
  private cdr = inject(ChangeDetectorRef);
  ngOnInit() : void{
    this.preLoginNavbarService.getNavbar().subscribe({
      next: (response) => {
        this.navItems = response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching navbar items:', error);
      }
    });
  }
}
