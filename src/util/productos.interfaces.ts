// En productos.interfaces.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | string; // Ajustar porque puede venir como string
  categoria: string;
  stock: number;
  estado: boolean;
  creado: string;
  actualizado: string;
  mercado: string | null; // También podría ser null
  imagen?: string; // AGREGAR ESTA LÍNEA - campo opcional
}
export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  mercado: string;
  imagen?: string; // Agrega esta propiedad como opcional
}