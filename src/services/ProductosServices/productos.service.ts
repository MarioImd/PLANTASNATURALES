import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, tap, catchError } from 'rxjs';
import { Producto, ProductoFormData } from '../../util/productos.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/productos/'; // URL directa
  private productoActualizadoSubject = new Subject<void>();
  productoActualizado$ = this.productoActualizadoSubject.asObservable();

  constructor(private http: HttpClient) {} // Elimina UrlMasterService

// ✅ Obtener todos los productos activos
getProductos(): Observable<Producto[]> {
  const url = `${this.apiUrl}`;
  console.log('URL solicitada:', url); // ← AGREGAR
  
  return this.http.get<Producto[]>(url).pipe(
    tap(response => console.log('Respuesta de API:', response)), // ← AGREGAR
    catchError(this.handleError)
  );
}
  // ✅ Obtener TODOS los productos (incluyendo inactivos)
  getAllProductos(): Observable<Producto[]> {
    const url = `${this.apiUrl}todos/`;
    return this.http.get<Producto[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Agregar nuevo producto
  addProducto(producto: ProductoFormData): Observable<Producto> {
    const url = `${this.apiUrl}agregar/`;
    
    return this.http.post<Producto>(url, producto).pipe(
      tap(() => this.productoActualizadoSubject.next()),
      catchError(this.handleError)
    );
  }

  // ✅ Obtener producto por ID
  getProductoById(id: number): Observable<Producto> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<Producto>(url).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Actualizar producto
  updateProducto(id: number, producto: ProductoFormData): Observable<Producto> {
    const url = `${this.apiUrl}${id}/editar/`;
    return this.http.put<Producto>(url, producto).pipe(
      tap(() => this.productoActualizadoSubject.next()),
      catchError(this.handleError)
    );
  }

  // ✅ Eliminar producto (cambiar estado a false)
  deleteProducto(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/eliminar/`;
    return this.http.delete<any>(url).pipe(
      tap(() => this.productoActualizadoSubject.next()),
      catchError(this.handleError)
    );
  }

  // ✅ Reactivar producto (cambiar estado a true)
  reactivarProducto(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/reactivar/`;
    return this.http.post<any>(url, {}).pipe(
      tap(() => this.productoActualizadoSubject.next()),
      catchError(this.handleError)
    );
  }

  // Método para manejar errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
      
      switch (error.status) {
        case 400:
          errorMessage = 'Error en la solicitud. Verifique los datos.';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicie sesión.';
          break;
        case 403:
          errorMessage = 'No tiene permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'Producto no encontrado.';
          break;
        case 409:
          errorMessage = 'Ya existe un producto con esa descripción (email).';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente más tarde.';
          break;
      }
    }
    
    console.error('Error en ProductoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}