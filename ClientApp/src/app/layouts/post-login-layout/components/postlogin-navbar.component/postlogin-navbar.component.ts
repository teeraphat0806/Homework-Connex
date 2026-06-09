import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'postlogin-navbar.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './postlogin-navbar.component.html',
  styleUrl: './postlogin-navbar.component.css',
})
export class PostloginNavbarComponent {
//   isMenuOpen = false;
//  public navItems: NavItemConfig[] = [];
//   toggleMenu() {
//     this.isMenuOpen = !this.isMenuOpen;
//   }

//   closeMenu() {
//     this.isMenuOpen = false;
//   }
//   constructor(){
//     this.navItems = [{ label: 'Home', link: '/home',pageUrl: '/home' },
//     { label: 'Profile', link: '/profile',pageUrl: '/profile' },
//     { label: 'Settings', link: '/settings',pageUrl: '/settings' },
//     { label: 'Logout', link: '/logout',pageUrl: '/logout' },
//   ];
//   }
 
//   public onNavBarChange(destination?: string, index?: number): void {
//     if (destination) {
//       const prefix = EnumSystemConfigKey.RoutePrefix;
//       if (destination.startsWith(prefix)) {
//         destination = destination.slice(prefix.length);
//         this.router.navigate([destination]);
//       } else {
//         window.location.href = destination;
//       }
//     } else if (index !== undefined) {
//       const item = this.navItems[index];
//       if (item?.destinationUrl) {
//         this.router.navigate([item.destinationUrl]);
//       } else {
//         this.router.navigate(['/main/home']);
//       }
//     }
//   }
}
