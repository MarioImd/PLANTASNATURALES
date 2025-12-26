import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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
    ToastModule,
    FileUploadModule,
    TooltipModule,
    CardModule,
    DividerModule,
    FloatLabelModule,

    InputGroupAddonModule,
InputGroupModule
  ],
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
  providers: [MessageService]
})
export class AgregarProductoComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('productoForm') productoForm!: NgForm;

  producto: ProductoFormData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    stock: 0,
    mercado: '',
    imagen: ''
  };

  categoriasDisponibles = [
    'Corporal Cosmetico',
    'Via oral (Capsulas y suplementos)',
    'Veterinaria',
    
  ];

  // Variables para manejo de archivos
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isUploadingImage = false;
  imageError: string | null = null;
  isLoading = false;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  // Manejar selección de archivo
  onFileSelect(event: any): void {
    console.log('📁 Archivo seleccionado:', event.files);
    this.imageError = null;

    if (event.files && event.files.length > 0) {
      const file = event.files[0];

      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        this.imageError = 'El archivo debe ser una imagen (JPG, PNG, GIF, etc.)';
        this.clearFileUpload();
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = 'La imagen no debe superar los 5MB';
        this.clearFileUpload();
        return;
      }

      this.selectedFile = file;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      this.messageService.add({
        severity: 'info',
        summary: 'Imagen seleccionada',
        detail: `Archivo: ${file.name}`,
        life: 3000
      });
    }
  }

  // Limpiar archivo seleccionado
  onFileClear(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imageError = null;
  }

  // Remover archivo seleccionado manualmente
  removeSelectedFile(): void {
    this.onFileClear();
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  // Enviar formulario - CORREGIDO
  onSubmit(): void {
    console.log('📤 Enviando formulario...');

    // Validación básica
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;

    // Crear FormData para enviar al servidor
    const formData = new FormData();

    // Agregar todos los campos del producto al FormData
    formData.append('nombre', this.producto.nombre);
    formData.append('descripcion', this.producto.descripcion);
    formData.append('precio', this.producto.precio.toString());
    formData.append('categoria', this.producto.categoria);
    formData.append('stock', this.producto.stock.toString());

    // ✅ AGREGAR ESTA LÍNEA: Enviar estado como true
    formData.append('estado', 'true');

    // Agregar mercado solo si tiene valor
    if (this.producto.mercado && this.producto.mercado.trim() !== '') {
      formData.append('mercado', this.producto.mercado);
    }

    // Agregar la imagen si existe
    if (this.selectedFile) {
      console.log('📤 Agregando imagen al FormData:', this.selectedFile.name);
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    // Mostrar en consola qué estamos enviando (para depuración)
    console.log('📦 Datos a enviar:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    });

    // Llamar al servicio para agregar producto
    this.productoService.addProductoFormData(formData).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del servidor:', response);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message || 'Producto agregado correctamente',
          life: 3000
        });

        // Limpiar formulario
        this.resetForm();

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('❌ Error al agregar producto:', error);

        let errorMessage = 'Error al agregar producto';

        if (error.error && error.error.errors) {
          // Mostrar errores específicos del backend
          const errors = error.error.errors;
          const errorDetails = Object.keys(errors)
            .map(key => `${key}: ${errors[key]}`)
            .join(', ');
          errorMessage = `Errores de validación: ${errorDetails}`;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  private validarFormulario(): boolean {
    console.log('🔍 Validando formulario...');

    if (!this.producto.nombre || !this.producto.nombre.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es requerido',
        life: 3000
      });
      return false;
    }

    if (!this.producto.descripcion || !this.producto.descripcion.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La descripción es requerida',
        life: 3000
      });
      return false;
    }

    // Validar longitud mínima de descripción
    if (this.producto.descripcion.trim().length < 5) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La descripción debe tener al menos 5 caracteres',
        life: 3000
      });
      return false;
    }

    if (!this.producto.categoria || !this.producto.categoria.trim()) {
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

  private clearFileUpload(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  private resetForm(): void {
    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      stock: 0,
      mercado: '',
      imagen: ''
    };
    this.clearFileUpload();
    this.imageError = null;
    if (this.productoForm) {
      this.productoForm.resetForm();
    }
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
  }
}