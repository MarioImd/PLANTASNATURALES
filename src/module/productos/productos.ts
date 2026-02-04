import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

import { Producto } from '../../util/productos.interfaces'; // Tu interfaz
import { ProductosLocalService } from '../../services/productos-local.service';
import { AuthService } from '../../services/auth/auth.services';
import { MessageService } from 'primeng/api';

// Nueva interfaz para el producto mapeado para la vista
interface ProductoVista {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  mercado: string | null;
  image: string | null;
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
  originalData: Producto;
}

@Component({
  selector: 'app-productos',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterLink,
    DataViewModule,
    TagModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
  providers: [MessageService]
})
export class Productos implements OnInit {
  products = signal<ProductoVista[]>([]); // Cambiar a ProductoVista[]
  productosOriginales: Producto[] = [];
  productosFiltrados: ProductoVista[] = []; // Productos después de filtrar
  categoriaActual: string | null = null; // Categoría seleccionada
  searchTerm: string = ''; // Término de búsqueda
  isLoading = true;
  error = signal<string | null>(null);
  isAdmin = false;
  private apiBaseUrl = 'http://localhost:8000';

  constructor(
    private productosLocalService: ProductosLocalService,
    private messageService: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    // Suscribirse a cambios en los query params
    this.route.queryParams.subscribe(params => {
      this.categoriaActual = params['categoria'] || null;
      console.log('📂 Categoría seleccionada:', this.categoriaActual);
      this.cargarProductos();
    });
  }

  // Función para obtener imágenes
  getProductImage(item: ProductoVista): string {
    console.log('🔍 getProductImage llamado para:', item.name); // Depuración

    if (!item) {
      console.warn('⚠️ Item es null/undefined');
      return 'https://placehold.co/160x120/ef4444/ffffff?text=Error';
    }

    // Depuración: ver qué datos tenemos
    console.log('📦 Item completo:', item);
    console.log('📷 Campo image:', item.image);
    console.log('📦 OriginalData:', item.originalData);
    console.log('📷 Imagen en originalData:', item.originalData?.imagen);

    // Opción 1: Usar el campo image del objeto mapeado
    let imagenPath = item.image || null;

    // Opción 2: Si no está en item.image, buscar en originalData
    if (!imagenPath && item.originalData) {
      imagenPath = item.originalData.imagen || null;
    }

    console.log('🔄 Ruta de imagen encontrada:', imagenPath);

    // Si no hay imagen, usar placeholder
    if (!imagenPath || imagenPath.trim() === '') {
      const nombreCorto = item.name ? item.name.substring(0, 10) : 'Producto';
      console.log('📭 No hay imagen, usando placeholder para:', nombreCorto);
      return `https://placehold.co/160x120/3b82f6/ffffff?text=${encodeURIComponent(nombreCorto)}`;
    }

    // Construir URL completa
    let finalUrl = '';

    if (imagenPath.startsWith('http')) {
      finalUrl = imagenPath;
    } else if (imagenPath.startsWith('/media/')) {
      finalUrl = `${this.apiBaseUrl}${imagenPath}`;
    } else if (!imagenPath.startsWith('/')) {
      finalUrl = `${this.apiBaseUrl}/media/${imagenPath}`;
    } else {
      finalUrl = `${this.apiBaseUrl}${imagenPath}`;
    }

    console.log('✅ URL final de imagen:', finalUrl);
    return finalUrl;
  }

  // Manejar error de carga de imagen
  handleImageError(event: any, item: ProductoVista): void {
    console.warn('Error cargando imagen para producto:', item.name);
    event.target.src = 'https://placehold.co/160x120/d1d5db/374151?text=Sin+Imagen';
    event.target.onerror = null;
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.error.set(null);

    this.productosLocalService.getProductosLocales().subscribe({
      next: (response: any) => {
        console.log('Respuesta de servicio local:', response);

        let productosArray: Producto[] = [];

        // Extraer array de productos según formato
        if (Array.isArray(response)) {
          productosArray = response;
        } else if (response && typeof response === 'object') {
          if (response.data && Array.isArray(response.data)) {
            productosArray = response.data;
          } else if (response.results && Array.isArray(response.results)) {
            productosArray = response.results;
          } else {
            // Si la respuesta es un objeto con un array de productos
            const data = response.data || response.results || response;
            if (Array.isArray(data)) {
              productosArray = data;
            }
          }
        }

        console.log('Productos extraídos:', productosArray);

        // Guardar productos originales (tipo Producto)
        this.productosOriginales = productosArray;

        // Mapear productos para la vista
        const productosMapeados = this.mapearProductosParaVista(productosArray);

        // Filtrar por categoría si hay una seleccionada
        if (this.categoriaActual) {
          this.productosFiltrados = productosMapeados.filter(p =>
            p.category.toLowerCase() === this.categoriaActual!.toLowerCase()
          );
          console.log(`🔍 Filtrando por categoría "${this.categoriaActual}": ${this.productosFiltrados.length} productos`);
        } else {
          this.productosFiltrados = productosMapeados;
        }

        this.products.set(this.productosFiltrados);
        this.isLoading = false;

        // Mensajes
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

  // Método para buscar productos
  onSearch(): void {
    console.log('🔍 Buscando:', this.searchTerm);

    // Obtener todos los productos mapeados
    const todosLosProductos = this.mapearProductosParaVista(this.productosOriginales);

    let productosFiltrados = todosLosProductos;

    // Filtrar por categoría si hay una seleccionada
    if (this.categoriaActual) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.category.toLowerCase() === this.categoriaActual!.toLowerCase()
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase().trim();
      productosFiltrados = productosFiltrados.filter(p =>
        p.name.toLowerCase().includes(termino) ||
        p.description.toLowerCase().includes(termino) ||
        p.category.toLowerCase().includes(termino)
      );
    }

    this.productosFiltrados = productosFiltrados;
    this.products.set(this.productosFiltrados);

    console.log(`📊 Resultados: ${this.productosFiltrados.length} productos`);
  }

  // Método para limpiar filtros
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.categoriaActual = null;
  }

  // Mapear productos de la API a la vista
  private mapearProductosParaVista(productosApi: Producto[]): ProductoVista[] {
    if (!productosApi || !Array.isArray(productosApi)) {
      return [];
    }

    return productosApi.map((producto: Producto, index: number) => {
      // Ahora TypeScript sabe que 'producto' es de tipo Producto
      const productoId = producto.id || index + 1;
      const nombre = producto.nombre || `Producto ${index + 1}`;
      const descripcion = producto.descripcion || 'Sin descripción';

      // Asegurar que precio sea un número
      let precio: number;
      if (typeof producto.precio === 'string') {
        precio = parseFloat(producto.precio) || 0;
      } else {
        precio = producto.precio || 0;
      }

      const categoria = producto.categoria || 'General';
      const stock = producto.stock || 0;
      const imagen = producto.imagen || null;
      const mercado = producto.mercado || null;

      const productoVista: ProductoVista = {
        id: productoId,
        name: nombre,
        description: descripcion,
        price: precio,
        category: categoria,
        stock: stock,
        mercado: mercado,
        image: imagen,
        inventoryStatus: this.obtenerEstadoInventario(stock),
        rating: this.calcularRating(producto),
        originalData: producto
      };

      return productoVista;
    });
  }

  // Resto de métodos con tipos correctos
  private obtenerEstadoInventario(stock: number): 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK' {
    if (stock === undefined || stock === null) return 'OUTOFSTOCK';
    if (stock > 10) return 'INSTOCK';
    if (stock > 0 && stock <= 10) return 'LOWSTOCK';
    return 'OUTOFSTOCK';
  }

  private calcularRating(producto: Producto): number {
    // Si el producto tuviera rating, lo usaríamos aquí
    return Math.random() * (5 - 3.5) + 3.5;
  }

  getSeverity(product: ProductoVista): 'success' | 'warn' | 'danger' {
    if (!product || !product.inventoryStatus) return 'success';

    switch (product.inventoryStatus) {
      case 'INSTOCK': return 'success';
      case 'LOWSTOCK': return 'warn';
      case 'OUTOFSTOCK': return 'danger';
      default: return 'success';
    }
  }

  formatearPrecio(precio: any): string {
    if (precio === undefined || precio === null) {
      return '$0.00';
    }

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

  // Métodos para acciones
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

  mostrarDatosOriginales(): void {
    console.log('Productos originales:', this.productosOriginales);
    console.log('Productos mapeados:', this.products());
  }

  confirmarEliminar(producto: Producto): void {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?\n\n` +
      'Esta acción cambiará el estado del producto a inactivo.'
    );

    if (confirmacion) {
      this.eliminarProducto(producto.id);
    }
  }

  eliminarProducto(id: number): void {
    // Funcionalidad de eliminación deshabilitada para datos locales
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: 'La eliminación de productos no está disponible en modo local',
      life: 3000
    });
  }
}