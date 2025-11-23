import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, // Add this for *ngIf
    MenubarModule, // Add this for p-menubar
    BadgeModule, // Add this for p-badge
    AvatarModule // Add this for p-avatar
  ],
  templateUrl: './navbar.html'
})
export class Navbar {
  // Add the items property that's referenced in the template
  items = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Products',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Plantas',
          icon: 'pi pi-leaf'
        },
        {
          label: 'Accesorios',
          icon: 'pi pi-tag'
        }
      ]
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle'
    }
    // Add more menu items as needed
  ];
}