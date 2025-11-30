import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';

// ============================================================================
// TODO BACKEND: Crear interface Product en un archivo separado (models/product.interface.ts)
// Esta interface debe coincidir con el modelo de la base de datos
// ============================================================================
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
}

@Component({
  selector: 'app-accesorios',
  imports: [CommonModule, ButtonModule, RouterLink, DataViewModule, TagModule],
  templateUrl: './accesorios.html',
  styleUrl: './accesorios.css',
})
export class Accesorios {
  // ============================================================================
  // TODO BACKEND: Reemplazar estos datos de ejemplo con una llamada al servicio
  // Para filtrar por categoría, pasar el parámetro en la URL del API
  // Ejemplo: this.productService.getProductsByCategory('Accesorios')
  // ============================================================================
  private allProducts = signal<Product[]>([
    {
      id: 1,
      name: 'Manzanilla Orgánica',
      description: 'Flores de manzanilla 100% naturales para infusiones relajantes',
      price: 12.99,
      category: 'Plantas Naturales',
      image: 'bamboo-watch.jpg',
      inventoryStatus: 'INSTOCK',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Lavanda Premium',
      description: 'Lavanda aromática de cultivo sustentable',
      price: 15.99,
      category: 'Plantas Naturales',
      image: 'black-watch.jpg',
      inventoryStatus: 'INSTOCK',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Jabón de Romero',
      description: 'Jabón artesanal con extracto de romero natural',
      price: 8.99,
      category: 'Accesorios',
      image: 'blue-band.jpg',
      inventoryStatus: 'LOWSTOCK',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Shampoo Natural para Mascotas',
      description: 'Shampoo hipoalergénico con ingredientes naturales',
      price: 18.50,
      category: 'Veterinaria',
      image: 'blue-t-shirt.jpg',
      inventoryStatus: 'INSTOCK',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Aceite Esencial de Eucalipto',
      description: 'Aceite esencial 100% puro para aromaterapia',
      price: 22.00,
      category: 'Accesorios',
      image: 'bracelet.jpg',
      inventoryStatus: 'OUTOFSTOCK',
      rating: 4.9
    },
    {
      id: 6,
      name: 'Té Verde Orgánico',
      description: 'Hojas de té verde de cultivo orgánico certificado',
      price: 14.50,
      category: 'Plantas Naturales',
      image: 'brown-purse.jpg',
      inventoryStatus: 'INSTOCK',
      rating: 4.6
    }
  ]);

  // Filtrar productos solo de la categoría "Accesorios"
  products = computed(() =>
    this.allProducts().filter(product => product.category === 'Accesorios')
  );

  // ============================================================================
  // Método para determinar la severidad del tag según el estado del inventario
  // ============================================================================
  getSeverity(product: Product): 'success' | 'warn' | 'danger' {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'success';
    }
  }
}
