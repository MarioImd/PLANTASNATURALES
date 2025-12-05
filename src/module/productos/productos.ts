import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Producto } from '../../util/productos.interfaces';
import { ProductoService } from '../../services/ProductosServices/productos.service';
import { AuthService } from '../../services/auth/auth.services';

@Component({
  selector: 'app-productos',
  imports: [
    CommonModule, 
    ButtonModule, 
    RouterLink, 
    DataViewModule, 
    TagModule,
    ToastModule,
    
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
  providers: [MessageService]
})
export class Productos implements OnInit {
  products = signal<any[]>([]);
  productosOriginales: Producto[] = []; // Para guardar los datos originales
  isLoading = true;
  error = signal<string | null>(null);
  isAdmin = false; // Variable para controlar si es admin

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
       this.isAdmin = this.authService.isAdmin();
    
    // Suscribirse a cambios (opcional)
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    
    this.cargarProductos();
  }

  cargarProductos(): void {
  this.isLoading = true;
  this.error.set(null);

  this.productoService.getProductos().subscribe({
    next: (response: any) => { // Usar 'any' temporalmente o el tipo correcto
      console.log('Respuesta completa de API:', response); // Para depuración
      console.log('Tipo de respuesta:', typeof response); // Para depuración
      
      // Manejar diferentes formatos de respuesta
      let productosArray: any[] = [];

      console.log('Respuesta completa de API:', response); // Para depuración
      console.log('Tipo de respuesta:', typeof response); // Para depuración
      
      // Si es un array directamente
      if (Array.isArray(response)) {
        console.log('Respuesta es un array directo');
        productosArray = response;
      } 
      // Si es un objeto con propiedad 'results' (paginación Django REST)
      else if (response && typeof response === 'object' && response.results && Array.isArray(response.results)) {
        console.log('Respuesta tiene propiedad results (paginación)');
        productosArray = response.results;
      } 
      // Si es un objeto con propiedad 'data'
      else if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
        console.log('Respuesta tiene propiedad data');
        productosArray = response.data;
      } 
      // Si es un objeto con estructura de producto
      else if (response && typeof response === 'object' && (response.id !== undefined || response.nombre !== undefined)) {
        console.log('Respuesta es un solo producto');
        productosArray = [response];
      } 
      // Si es un objeto pero no array (convertir valores)
      else if (response && typeof response === 'object' && !Array.isArray(response)) {
        console.log('Respuesta es un objeto, convirtiendo a array');
        // Intentar extraer productos de diferentes maneras
        const values = Object.values(response);
        
   
        
        if (productosArray.length === 0) {
          // Si no encontramos productos, usar todos los valores
          productosArray = values.filter(item => item !== null && item !== undefined);
        }
      }
      // Si la respuesta es null/undefined o no es objeto/array
      else if (response === null || response === undefined) {
        console.log('Respuesta es null/undefined');
        productosArray = [];
      }
      else {
        console.error('Formato de respuesta no reconocido:', response);
        this.error.set('Formato de datos no válido');
        productosArray = [];
      }

      console.log('Productos extraídos:', productosArray); // Para depuración
      console.log('Número de productos:', productosArray.length); // Para depuración
      
      // Guardar productos originales
      this.productosOriginales = productosArray as Producto[];
      
      // Mapear productos para la vista
      this.products.set(this.mapearProductosParaVista(productosArray));
      this.isLoading = false;
      
      // Mostrar mensaje si no hay productos
      if (productosArray.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Sin productos',
          detail: 'No hay productos disponibles',
          life: 3000
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Productos cargados',
          detail: `Se cargaron ${productosArray.length} productos`,
          life: 3000
        });
      }
    },
    error: (err: any) => {
      this.error.set('Error al cargar productos');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los productos',
        life: 5000
      });
      this.isLoading = false;
      console.error('Error cargando productos:', err);
    }
  });
}

  // Mapear productos de la API a la vista
  private mapearProductosParaVista(productosApi: any[]): any[] {
    if (!productosApi || !Array.isArray(productosApi)) {
      console.error('productosApi no es un array:', productosApi);
      return [];
    }
    
    return productosApi.map((producto, index) => {
      // Proporcionar valores por defecto para evitar errores
      const productoId = producto.id || producto.ID || index + 1;
      const nombre = producto.nombre || producto.name || `Producto ${index + 1}`;
      const descripcion = producto.descripcion || producto.description || 'Sin descripción';
      
      // Asegurar que precio sea un número
      let precio = producto.precio || producto.price || 0;
      if (typeof precio === 'string') {
        precio = parseFloat(precio) || 0;
      }
      
      const categoria = producto.categoria || producto.category || 'General';
      const stock = producto.stock || 0;
      
      return {
        id: productoId,
        name: nombre,
        description: descripcion,
        price: precio,
        category: categoria,
        stock: stock,
        mercado: producto.mercado || null,
        image: this.obtenerImagenPorCategoria(categoria),
        inventoryStatus: this.obtenerEstadoInventario(stock),
        rating: this.calcularRating(producto),
        // Guardar datos originales por si se necesitan
        originalData: producto
      };
    });
  }

  // Función para determinar el estado del inventario basado en el stock
  private obtenerEstadoInventario(stock: number): 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK' {
    if (stock === undefined || stock === null) return 'OUTOFSTOCK';
    if (stock > 10) return 'INSTOCK';
    if (stock > 0 && stock <= 10) return 'LOWSTOCK';
    return 'OUTOFSTOCK';
  }

  // Función para obtener imagen según categoría
  private obtenerImagenPorCategoria(categoria: string): string {
    const imagenesPorCategoria: {[key: string]: string} = {
      'Suplementos': 'bamboo-watch.jpg',
      'Tés e Infusiones': 'black-watch.jpg',
      'Aceites Esenciales': 'blue-band.jpg',
      'Cuidado Personal': 'blue-t-shirt.jpg',
      'Veterinaria': 'bracelet.jpg',
      'Electrónica': 'brown-purse.jpg',
      'Plantas Naturales': 'chakra-bracelet.jpg',
      'Accesorios': 'galaxy-earrings.jpg',
      'General': 'product-default.jpg',
      'Planta': 'green-earbuds.jpg',
      'Infusión': 'green-t-shirt.jpg'
    };
    
    return imagenesPorCategoria[categoria] || 'product-default.jpg';
  }

  // Calcular rating
  private calcularRating(producto: any): number {
    // Puedes personalizar esta lógica
    // Por ejemplo, si el producto tiene rating, usarlo
    if (producto.rating !== undefined && producto.rating !== null) {
      const ratingNum = parseFloat(producto.rating);
      if (!isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 5) {
        return ratingNum;
      }
    }
    
    // Si no, generar un rating aleatorio entre 3.5 y 5
    return Math.random() * (5 - 3.5) + 3.5;
  }

  // Método para determinar la severidad del tag según el estado del inventario
  getSeverity(product: any): 'success' | 'warn' | 'danger' {
    if (!product || !product.inventoryStatus) return 'success';
    
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

  // Métodos para funcionalidades adicionales
  agregarAlCarrito(productId: number): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: 'Producto añadido al carrito',
      life: 3000
    });
  }

  agregarAFavoritos(productId: number): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Favoritos',
      detail: 'Producto añadido a favoritos',
      life: 3000
    });
  }

  // Función para formatear el precio - CORREGIDA
  formatearPrecio(precio: any): string {
    if (precio === undefined || precio === null) {
      return '$0.00';
    }
    
    // Convertir a número si es string
    let precioNum: number;
    if (typeof precio === 'string') {
      precioNum = parseFloat(precio);
      if (isNaN(precioNum)) {
        return '$0.00';
      }
    } else if (typeof precio === 'number') {
      precioNum = precio;
    } else {
      return '$0.00';
    }
    
    return `$${precioNum.toFixed(2)}`;
  }

  // Función para depurar - muestra los datos originales en consola
  mostrarDatosOriginales(): void {
    console.log('Productos originales:', this.productosOriginales);
    console.log('Productos mapeados:', this.products());
  }

    // Método para confirmar eliminación
  // Método para confirmar eliminación
  confirmarEliminar(producto: Producto): void {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?\n\n` +
      'Esta acción cambiará el estado del producto a inactivo.'
    );
    
    if (confirmacion) {
      this.eliminarProducto(producto.id);
    }
  }
  
  // Método para eliminar el producto
  eliminarProducto(id: number): void {
    this.productoService.deleteProducto(id).subscribe({
      next: (response) => {
        alert('Producto eliminado correctamente');
        this.cargarProductos(); // Recargar la lista
      },
      error: (error) => {
        alert(`Error al eliminar producto: ${error.message}`);
        console.error('Error:', error);
      }
    });
  }
  
}