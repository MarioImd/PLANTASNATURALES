# Guía de Integración Backend - Módulo de Productos

Esta guía proporciona instrucciones detalladas para que el equipo de backend integre la funcionalidad de productos con la base de datos.

## 📋 Tabla de Contenidos

1. [Modelo de Datos](#modelo-de-datos)
2. [Servicio de Productos](#servicio-de-productos)
3. [Endpoint del Backend](#endpoint-del-backend)
4. [Integración en el Componente](#integración-en-el-componente)
5. [Gestión de Imágenes](#gestión-de-imágenes)
6. [Funcionalidades Adicionales](#funcionalidades-adicionales)

---

## 1. Modelo de Datos

### Interface Product

Crear el archivo: `src/models/product.interface.ts`

```typescript
export interface Product {
  id: number | string;           // ID único del producto en la BD
  name: string;                  // Nombre del producto
  description: string;           // Descripción detallada
  price: number;                 // Precio en la moneda local
  category: string;              // Categoría del producto
  image: string;                 // Nombre o URL de la imagen
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';  // Estado del inventario
  rating: number;                // Calificación promedio (0-5)
}
```

### Campos Requeridos en la Base de Datos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | INT/VARCHAR | Identificador único | `1` o `"prod-001"` |
| `name` | VARCHAR(255) | Nombre del producto | `"Manzanilla Orgánica"` |
| `description` | TEXT | Descripción del producto | `"Flores de manzanilla 100% naturales..."` |
| `price` | DECIMAL(10,2) | Precio del producto | `12.99` |
| `category` | VARCHAR(100) | Categoría | `"Plantas Naturales"` |
| `image` | VARCHAR(255) | Ruta/nombre de imagen | `"manzanilla.jpg"` |
| `inventory_status` | ENUM | Estado del inventario | `"INSTOCK"` |
| `rating` | DECIMAL(2,1) | Calificación promedio | `4.5` |

---

## 2. Servicio de Productos

### Crear ProductService

Crear el archivo: `src/services/product.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos desde el backend
   * @returns Observable con array de productos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Obtiene un producto por ID
   * @param id - ID del producto
   * @returns Observable con el producto
   */
  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene productos por categoría
   * @param category - Nombre de la categoría
   * @returns Observable con array de productos filtrados
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }
}
```

### Configurar Environment

Actualizar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',  // URL de tu backend
  imageBaseUrl: 'http://localhost:3000/images/products/'  // URL base para imágenes
};
```

---

## 3. Endpoint del Backend

### Especificación del API

#### GET /api/products

**Descripción:** Obtiene todos los productos

**Response:**
```json
[
  {
    "id": 1,
    "name": "Manzanilla Orgánica",
    "description": "Flores de manzanilla 100% naturales para infusiones relajantes",
    "price": 12.99,
    "category": "Plantas Naturales",
    "image": "manzanilla.jpg",
    "inventoryStatus": "INSTOCK",
    "rating": 4.5
  },
  {
    "id": 2,
    "name": "Lavanda Premium",
    "description": "Lavanda aromática de cultivo sustentable",
    "price": 15.99,
    "category": "Plantas Naturales",
    "image": "lavanda.jpg",
    "inventoryStatus": "LOWSTOCK",
    "rating": 4.8
  }
]
```

#### GET /api/products/:id

**Descripción:** Obtiene un producto específico por ID

**Response:**
```json
{
  "id": 1,
  "name": "Manzanilla Orgánica",
  "description": "Flores de manzanilla 100% naturales para infusiones relajantes",
  "price": 12.99,
  "category": "Plantas Naturales",
  "image": "manzanilla.jpg",
  "inventoryStatus": "INSTOCK",
  "rating": 4.5
}
```

#### GET /api/products/category/:category

**Descripción:** Obtiene productos filtrados por categoría

**Response:** Array de productos de la categoría especificada

---

## 4. Integración en el Componente

### Actualizar productos.ts

Reemplazar el contenido actual de `src/module/productos/productos.ts`:

```typescript
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ButtonModule, RouterLink, DataViewModule, TagModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga los productos desde el backend
   */
  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error.set('No se pudieron cargar los productos. Por favor, intente más tarde.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Determina la severidad del tag según el estado del inventario
   */
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

  /**
   * TODO: Implementar funcionalidad de agregar al carrito
   */
  addToCart(productId: number | string): void {
    console.log('Agregar al carrito:', productId);
    // Implementar lógica de carrito aquí
  }

  /**
   * TODO: Implementar funcionalidad de agregar a favoritos
   */
  addToFavorites(productId: number | string): void {
    console.log('Agregar a favoritos:', productId);
    // Implementar lógica de favoritos aquí
  }
}
```

### Actualizar productos.html

En el archivo `src/module/productos/productos.html`, actualizar la línea del DataView:

```html
<!-- Cambiar esto: -->
<p-dataview [value]="products()" [rows]="5" [paginator]="true">

<!-- Por esto (para mostrar estado de carga): -->
<p-dataview [value]="products()" [rows]="5" [paginator]="true" [loading]="loading()">
```

Y agregar los event handlers a los botones:

```html
<!-- Botón de favoritos -->
<p-button 
  icon="pi pi-heart" 
  [outlined]="true" 
  (click)="addToFavorites(item.id)"
/>

<!-- Botón de compra -->
<p-button
  icon="pi pi-shopping-cart"
  class="flex-auto md:flex-initial whitespace-nowrap"
  label="Buy Now"
  [disabled]="item.inventoryStatus === 'OUTOFSTOCK'"
  (click)="addToCart(item.id)"
/>
```

---

## 5. Gestión de Imágenes

### Configuración de URL de Imágenes

En `productos.html`, actualizar la URL de las imágenes:

```html
<!-- Cambiar esto: -->
[src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + item.image"

<!-- Por esto: -->
[src]="imageBaseUrl + item.image"
```

Y en `productos.ts`, agregar la propiedad:

```typescript
import { environment } from '../../environments/environment';

export class Productos implements OnInit {
  imageBaseUrl = environment.imageBaseUrl;
  // ... resto del código
}
```

### Estructura de Almacenamiento de Imágenes

Recomendación para el servidor:

```
/public
  /images
    /products
      manzanilla.jpg
      lavanda.jpg
      romero.jpg
      ...
```

---

## 6. Funcionalidades Adicionales

### A. Servicio de Carrito de Compras

Crear `src/services/cart.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  getCartItems() {
    return this.cartItems();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.set([...currentCart]);
    } else {
      this.cartItems.set([...currentCart, { product, quantity }]);
    }
  }

  removeFromCart(productId: number | string): void {
    const currentCart = this.cartItems();
    this.cartItems.set(currentCart.filter(item => item.product.id !== productId));
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getTotalPrice(): number {
    return this.cartItems().reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }
}
```

### B. Servicio de Favoritos

Crear `src/services/favorites.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = signal<Product[]>([]);

  getFavorites() {
    return this.favorites();
  }

  addToFavorites(product: Product): void {
    const currentFavorites = this.favorites();
    if (!currentFavorites.find(p => p.id === product.id)) {
      this.favorites.set([...currentFavorites, product]);
    }
  }

  removeFromFavorites(productId: number | string): void {
    const currentFavorites = this.favorites();
    this.favorites.set(currentFavorites.filter(p => p.id !== productId));
  }

  isFavorite(productId: number | string): boolean {
    return this.favorites().some(p => p.id === productId);
  }
}
```

---

## 📝 Checklist de Integración

- [ ] Crear modelo `Product` interface
- [ ] Implementar `ProductService` con métodos HTTP
- [ ] Configurar variables de entorno (`environment.ts`)
- [ ] Crear endpoint `/api/products` en el backend
- [ ] Configurar servidor de imágenes
- [ ] Actualizar componente `Productos` para usar el servicio
- [ ] Implementar manejo de estados de carga y error
- [ ] Agregar funcionalidad de carrito de compras
- [ ] Agregar funcionalidad de favoritos
- [ ] Probar integración completa

---

## 🔧 Troubleshooting

### Error: CORS

Si encuentras errores de CORS, configura el backend para permitir peticiones desde el frontend:

```javascript
// Express.js ejemplo
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Error: Imágenes no se cargan

Verifica que:
1. La URL base de imágenes esté correctamente configurada
2. El servidor esté sirviendo archivos estáticos
3. Los nombres de archivo en la BD coincidan con los archivos físicos

---

## 📞 Contacto

Para cualquier duda sobre la integración, contactar al equipo de frontend.
