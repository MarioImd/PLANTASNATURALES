import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-index',
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  // Categorías de productos para mostrar en la página principal
  categories = [
    {
      title: 'Plantas Naturales',
      description: 'Descubre el poder curativo de la naturaleza',
      icon: '🌿',
      route: '/plantas',
      color: '#4a9d6f'
    },
    {
      title: 'Accesorios',
      description: 'Complementos naturales para tu bienestar',
      icon: '🧴',
      route: '/accesorios',
      color: '#6ba587'
    },
    {
      title: 'Veterinaria',
      description: 'Cuidado natural para tus mascotas',
      icon: '🐾',
      route: '/veterinaria',
      color: '#5dae9e'
    }
  ];
}
