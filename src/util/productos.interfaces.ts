export interface Producto {
  id: number;
  nombre: string;
  descripcion: string; // Este es un EMAIL en tu API
  precio: number;
  categoria: string;
  stock: number;
  estado: boolean;
  creado: string;
  actualizado: string;
  mercado: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string; // Email
  precio: number;
  categoria: string;   // ← CAMBIAR de 'tipo' a 'categoria'
  stock: number;
  mercado: string;
}