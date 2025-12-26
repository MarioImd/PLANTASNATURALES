import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth/auth.services';

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
  getInitials(arg0: any): string | undefined {
    throw new Error('Method not implemented.');
  }
  currentUser: any = null;
  isAdmin: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    // Suscribirse a los cambios del usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });


  }
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
          label: 'Corporal Cosmetico',
          icon: 'pi pi-sun',
          route: '/productos',
          command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Corporal Cosmetico' } });
          }
        },
        {
          label: 'Capsulas',
          icon: 'pi pi-box',
          route: '/productos',
          command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Capsulas' } });
          }
        },
        {
          label: 'Veterinaria',
          icon: 'pi pi-heart',
          route: '/productos',
          command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Veterinaria' } });
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

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso');
        // La redirección ya se maneja en el servicio
      },
      error: (error) => {
        console.error('Error en logout:', error);
        // Si falla la llamada HTTP, hacer logout local
      }
    });
  }
}