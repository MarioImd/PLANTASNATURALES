import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    BadgeModule,
    AvatarModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private router: Router) { }

  items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        this.router.navigate(['/']);
      }
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      command: () => {
        this.router.navigate(['/about']);
      }
    },
    {
      label: 'Products',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Todos los Productos',
          icon: 'pi pi-shopping-bag',
          command: () => {
            this.router.navigate(['/productos']);
          }
        },
        {
          label: 'Plantas',
          icon: 'pi pi-leaf',
          command: () => {
            this.router.navigate(['/plantas']);
          }
        },
        {
          label: 'Accesorios',
          icon: 'pi pi-tag',
          command: () => {
            this.router.navigate(['/accesorios']);
          }
        },
        {
          label: 'Veterinaria',
          icon: 'pi pi-heart',
          command: () => {
            this.router.navigate(['/veterinaria']);
          }
        }
      ]
    },
    {
      label: 'Puntos de venta',
      icon: 'pi pi-phone',
      command: () => {
        this.router.navigate(['/puntos-venta']);
      }
    },
    {
      label: 'Contacto',
      icon: 'pi pi-phone',
      command: () => {
        this.router.navigate(['/contacto']);
      }
    },
  ];
}