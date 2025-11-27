# Guía de Integración Backend - Módulo de Productos

## 📋 Resumen
Este documento describe cómo integrar el módulo de productos con el backend una vez que la base de datos esté lista.

---

## 🗂️ Estructura de Datos

### Interface Product
El componente espera recibir productos con la siguiente estructura:

```typescript
interface Product {
  id: number;                    // ID único del producto
  name: string;                  // Nombre del producto
  description: string;           // Descripción breve del producto
  price: number;                 // Precio del producto
  category: string;              // Categoría (Plantas Naturales, Accesorios, Veterinaria)
  image: string;                 // URL de la imagen del producto
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';  // Estado del inventario
  rating: number;                // Calificación del producto (0-5)
}
```

---

## 🔧 Pasos de Integración

### 1. Crear el Servicio de Productos

Crear el archivo: `src/services/product.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://your-backend-url/api/products'; // TODO: Actualizar con URL real

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Obtener productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
```

### 2. Actualizar el Componente Productos

Modificar `src/module/productos/productos.ts`:

```typescript
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../../services/product.service';

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
  selector: 'app-productos',
  imports: [CommonModule, ButtonModule, RouterLink, DataViewModule, TagModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Cargar productos desde el backend
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    });
  }

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
```

### 3. Configurar HttpClient

Asegurarse de que `HttpClient` esté configurado en `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... otros providers
  ]
};
```

---

## 🖼️ Gestión de Imágenes

### Opciones para almacenar imágenes:

1. **Servidor propio**: Guardar imágenes en el servidor backend
   - URL ejemplo: `https://api.example.com/images/products/producto-1.jpg`

2. **CDN/Cloud Storage**: Usar servicios como AWS S3, Cloudinary, etc.
   - URL ejemplo: `https://cdn.example.com/products/producto-1.jpg`

3. **Base de datos**: Guardar URLs de imágenes en la base de datos
   - La tabla de productos debe tener un campo `image_url`

### Actualizar el HTML para usar URLs reales:

En `productos.html`, cambiar:
```html
[src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + item.image"
```

Por:
```html
[src]="item.image"
```

---

## 🎯 Endpoints del Backend Requeridos

### GET /api/products
Obtener todos los productos

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "name": "Manzanilla Orgánica",
    "description": "Flores de manzanilla 100% naturales para infusiones relajantes",
    "price": 12.99,
    "category": "Plantas Naturales",
    "image": "https://api.example.com/images/manzanilla.jpg",
    "inventoryStatus": "INSTOCK",
    "rating": 4.5
  }
]
```

### GET /api/products/:id
Obtener un producto específico

**Respuesta esperada:**
```json
{
  "id": 1,
  "name": "Manzanilla Orgánica",
  "description": "Flores de manzanilla 100% naturales para infusiones relajantes",
  "price": 12.99,
  "category": "Plantas Naturales",
  "image": "https://api.example.com/images/manzanilla.jpg",
  "inventoryStatus": "INSTOCK",
  "rating": 4.5
}
```

### GET /api/products?category=:category
Filtrar productos por categoría

**Categorías válidas:**
- "Plantas Naturales"
- "Accesorios"
- "Veterinaria"

---

## 🛒 Funcionalidades Adicionales a Implementar

### 1. Carrito de Compras
```typescript
// En el servicio
addToCart(productId: number, quantity: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/cart`, { productId, quantity });
}
```

### 2. Favoritos
```typescript
// En el servicio
addToFavorites(productId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/favorites`, { productId });
}
```

### 3. Búsqueda y Filtros
```typescript
// En el servicio
searchProducts(query: string): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
}

filterProducts(filters: any): Observable<Product[]> {
  return this.http.post<Product[]>(`${this.apiUrl}/filter`, filters);
}
```

---

## 📊 Modelo de Base de Datos Sugerido

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  inventory_status VARCHAR(20) DEFAULT 'INSTOCK',
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_inventory_status ON products(inventory_status);
```

---

## ✅ Checklist de Integración

- [ ] Crear tabla de productos en la base de datos
- [ ] Implementar endpoints del backend
- [ ] Configurar almacenamiento de imágenes
- [ ] Crear ProductService en Angular
- [ ] Actualizar componente Productos para usar el servicio
- [ ] Configurar HttpClient en app.config.ts
- [ ] Actualizar URLs de imágenes en el HTML
- [ ] Probar la carga de productos
- [ ] Implementar manejo de errores
- [ ] Agregar funcionalidad de carrito (opcional)
- [ ] Agregar funcionalidad de favoritos (opcional)

---

## 🐛 Solución de Problemas

### Error CORS
Si hay errores de CORS, configurar en el backend:
```javascript
// Node.js/Express ejemplo
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Imágenes no se cargan
- Verificar que las URLs sean accesibles públicamente
- Revisar permisos de archivos en el servidor
- Comprobar configuración de CORS para imágenes

---

## 📞 Contacto

Para dudas sobre la integración, contactar al equipo de frontend.
