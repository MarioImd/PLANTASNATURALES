import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    RippleModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private router: Router) { }

  items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      route: '/',
      command: () => {
        this.router.navigate(['/']);
      }
    },
    {
      label: 'Productos',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Todos los Productos',
          icon: 'pi pi-th-large',
          route: '/productos',
          command: () => {
            this.router.navigate(['/productos']);
          }
        },
        {
          separator: true
        },
        {
          label: 'Plantas Naturales',
          icon: 'pi pi-sun',
          route: '/plantas',
          command: () => {
            this.router.navigate(['/plantas']);
          }
        },
        {
          label: 'Accesorios',
          icon: 'pi pi-box',
          route: '/accesorios',
          command: () => {
            this.router.navigate(['/accesorios']);
          }
        },
        {
          label: 'Veterinaria',
          icon: 'pi pi-heart',
          route: '/veterinaria',
          command: () => {
            this.router.navigate(['/veterinaria']);
          }
        }
      ]
    },
    {
      label: 'Nosotros',
      icon: 'pi pi-users',
      route: '/about',
      command: () => {
        this.router.navigate(['/about']);
      }
    },
    {
      label: 'Puntos de Venta',
      icon: 'pi pi-map-marker',
      route: '/puntos-venta',
      command: () => {
        this.router.navigate(['/puntos-venta']);
      }
    }
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}