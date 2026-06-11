import { CommonModule } from '@angular/common';
import { Component, inject ,ChangeDetectorRef} from '@angular/core';
import { Router, RouterLink,RouterLinkActive  } from '@angular/router';
import { AuthApiService } from '../../../../modules/authentication/services/auth.service';
import { PostLoginNavbarService } from '../../services/navbar.service';
import { NavbarItemModel } from '../../models/navbar.model';
import { HomeworkButton } from '../../../../shared/components/homework-button/homework-button.component';
@Component({
  selector: 'app-postlogin-navbar',
  imports: [CommonModule, HomeworkButton, RouterLink, RouterLinkActive],
  templateUrl: './postlogin-navbar.component.html',
  styleUrl: './postlogin-navbar.component.css',
})
export class PostloginNavbarComponent {
  public navItems: NavbarItemModel[] = [];
  private router = inject(Router);
  private authService = inject(AuthApiService);  
  private postLoginNavbarService = inject(PostLoginNavbarService);
  private cdr = inject(ChangeDetectorRef);
  ngOnInit() : void{
    this.postLoginNavbarService.getNavbar().subscribe({
      next: (response) => {
        this.navItems = response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching navbar items:', error);
      }
    });
  }
  public onLogOut(): void {
    this.authService.Logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }


}
