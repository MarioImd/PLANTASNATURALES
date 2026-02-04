import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-index',
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {


  constructor(private router: Router) {}
  // Categorías de productos para mostrar en la página principal
  categories = [
    {
      title: 'Plantas Naturales',
      description: 'Descubre el poder curativo de la naturaleza',
      icon: '🌿',
      route: '/productos',
      color: '#4a9d6f',
       command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Capsulas' } });
          }
    },

         
    {
      title: 'Accesorios',
      description: 'Complementos naturales para tu bienestar',
      icon: '🧴',
      route: '/productos',
      color: '#6ba587',
            command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Corporal Cosmetico' } });
          }
    },
    {
      title: 'Veterinaria',
      description: 'Cuidado natural para tus mascotas',
      icon: '🐄',
      route: '/productos',
      color: '#5dae9e',
        command: () => {
            this.router.navigate(['/productos'], { queryParams: { categoria: 'Veterinaria' } });
          }
       
    }
  ];
}
