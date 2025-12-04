import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ProductoFormData } from '../../../util/productos.interfaces';
import { ProductoService } from '../../../services/ProductosServices/productos.service';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule
  ],
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
  providers: [MessageService]
})
export class AgregarProductoComponent implements OnInit {
  producto: ProductoFormData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',    // ← CAMBIADO: 'tipo' por 'categoria'
    stock: 0,
    mercado: ''
  };

  // Variable con el nombre CORRECTO (sin tilde si prefieres)
  categoriasDisponibles = [
    'Suplementos',
    'Tés e Infusiones', 
    'Aceites Esenciales',
    'Cuidado Personal',
    'Veterinaria',
    'Electrónica',
    'Otros'
  ];

  isLoading = false;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Validación básica - CAMBIADO: 'tipo' por 'categoria'
    if (!this.producto.nombre || !this.producto.descripcion || !this.producto.categoria) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000
      });
      return;
    }

    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    
    this.productoService.addProducto(this.producto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto agregado correctamente',
          life: 3000
        });
        
        // Limpiar formulario - CAMBIADO: 'tipo' por 'categoria'
        this.producto = {
          nombre: '',
          descripcion: '',
          precio: 0,
          categoria: '',
          stock: 0,
          mercado: ''
        };
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 2000);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al agregar producto',
          life: 5000
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.producto.nombre.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es requerido',
        life: 3000
      });
      return false;
    }

    if (!this.producto.descripcion.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El email de descripción es requerido',
        life: 3000
      });
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.producto.descripcion)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La descripción debe ser un email válido',
        life: 3000
      });
      return false;
    }

    // CAMBIADO: 'tipo' por 'categoria'
    if (!this.producto.categoria.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione una categoría de producto',
        life: 3000
      });
      return false;
    }

    if (this.producto.precio <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El precio debe ser mayor a 0',
        life: 3000
      });
      return false;
    }

    if (this.producto.stock < 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El stock no puede ser negativo',
        life: 3000
      });
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
  }
}