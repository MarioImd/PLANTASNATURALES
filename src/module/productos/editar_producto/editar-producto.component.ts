import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto, ProductoFormData } from '../../../util/productos.interfaces';
import { Location } from '@angular/common';
import { ProductoService } from '../../../services/ProductosServices/productos.service';
import { MessageService } from 'primeng/api';

// PrimeNG Imports - VERSIÓN CORREGIDA
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';  // Agregar para manejo de archivos
import { MessageModule } from 'primeng/message';  // Para mensajes de error
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // PrimeNG Modules - VERSIÓN CORREGIDA
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    
    AutoCompleteModule,  // ✅ Aquí está el módulo correcto
    ToggleSwitchModule,
    ToastModule,
    CardModule,
    PanelModule,
    FileUploadModule,  // Agregar para subir archivos
    MessageModule  // Para mensajes de error
  ],
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  providers: [MessageService]
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  producto: Producto | null = null;
  isLoading = false;
  isLoadingData = false;
  errorMessage = '';
  productoId: number | null = null;
  
  // Variables para manejo de imagen
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  currentImageUrl: string | null = null;
  
  // Categorías disponibles para el dropdown - VERSIÓN CORREGIDA
  categoriasDisponibles: any[] = [
    { label: 'Suplementos', value: 'Suplementos' },
    { label: 'Tés e Infusiones', value: 'Tés e Infusiones' },
    { label: 'Aceites Esenciales', value: 'Aceites Esenciales' },
    { label: 'Cuidado Personal', value: 'Cuidado Personal' },
    { label: 'Veterinaria', value: 'Veterinaria' },
    { label: 'Electrónica', value: 'Electrónica' },
    { label: 'Otros', value: 'Otros' }
  ];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.email]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: [null, Validators.required],  // Cambiado a null para dropdown
      stock: [0, [Validators.required, Validators.min(0)]],
      mercado: [''],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productoId = +params['id'];
      console.log('🆔 ID del producto a editar:', this.productoId);
      if (this.productoId) {
        this.loadProducto(this.productoId);
      } else {
        this.errorMessage = 'ID de producto no válido';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage
        });
      }
    });
  }

  loadProducto(id: number): void {
    this.isLoadingData = true;
    this.errorMessage = '';
    
    console.log('📥 Cargando producto con ID:', id);
    
    this.productoService.getProductoById(id).subscribe({
      next: (producto: Producto) => {
        console.log('✅ Producto cargado:', producto);
        this.producto = producto;
        
        // Mostrar la imagen actual si existe
        if (producto.imagen) {
          this.currentImageUrl = this.getProductImageUrl(producto.imagen);
          console.log('📷 URL de imagen actual:', this.currentImageUrl);
        }
        
        // Encontrar el objeto categoría correspondiente
        const categoriaObj = this.categoriasDisponibles.find(
          cat => cat.value === producto.categoria || cat.label === producto.categoria
        );
        
        // Actualizar formulario con datos del producto
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: typeof producto.precio === 'string' ? parseFloat(producto.precio) : producto.precio,
          categoria: categoriaObj || producto.categoria,  // Usar objeto o valor
          stock: producto.stock,
          mercado: producto.mercado || '',
          estado: producto.estado
        });
        
        console.log('📝 Formulario actualizado con valores:', this.productoForm.value);
        
        this.isLoadingData = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Cargado',
          detail: 'Producto cargado correctamente',
          life: 3000
        });
      },
      error: (error: any) => {
        console.error('❌ Error al cargar producto:', error);
        this.errorMessage = `Error al cargar el producto: ${error.message || 'Error desconocido'}`;
        this.isLoadingData = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
          life: 5000
        });
      }
    });
  }

  private getProductImageUrl(imagenPath: string): string {
    if (!imagenPath) return '';
    
    if (imagenPath.startsWith('http')) {
      return imagenPath;
    }
    
    if (imagenPath.startsWith('/media/')) {
      return `http://localhost:8000${imagenPath}`;
    }
    
    if (!imagenPath.startsWith('/')) {
      return `http://localhost:8000/media/${imagenPath}`;
    }
    
    return `http://localhost:8000${imagenPath}`;
  }

  onFileSelect(event: any): void {
    console.log('📁 Evento de selección de archivo:', event);
    
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      console.log('📄 Archivo seleccionado:', file.name, file.type, file.size);
      
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        this.errorMessage = 'El archivo debe ser una imagen (JPG, PNG, GIF, etc.)';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
          life: 5000
        });
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar los 5MB';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
          life: 5000
        });
        return;
      }
      
      this.selectedFile = file;
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.currentImageUrl = null; // Ocultar imagen anterior si hay nueva
        console.log('🖼️ Vista previa creada');
      };
      reader.readAsDataURL(file);
      
      this.messageService.add({
        severity: 'info',
        summary: 'Imagen seleccionada',
        detail: `Imagen: ${file.name}`,
        life: 3000
      });
    }
  }

  removeSelectedFile(): void {
    console.log('🗑️ Removiendo archivo seleccionado');
    this.selectedFile = null;
    this.imagePreview = null;
    
    // Restaurar imagen original si existe
    if (this.producto?.imagen) {
      this.currentImageUrl = this.getProductImageUrl(this.producto.imagen);
    }
  }

  onSubmit(): void {
    console.log('📤 Enviando formulario...');
    
    if (this.productoForm.invalid || !this.productoId) {
      console.log('❌ Formulario inválido o sin ID');
      this.productoForm.markAllAsTouched();
      
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        if (control?.invalid) {
          console.log(`❌ Campo ${key} inválido:`, control.errors);
        }
      });
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Crear FormData para enviar al servidor
    const formData = new FormData();
    
    // Agregar todos los campos del formulario
    const formValues = this.productoForm.value;
    console.log('📦 Valores del formulario:', formValues);
    
    // Obtener el valor de categoría (puede ser objeto o string)
    const categoriaValue = formValues.categoria?.value || formValues.categoria;
    
    formData.append('nombre', formValues.nombre);
    formData.append('descripcion', formValues.descripcion);
    formData.append('precio', formValues.precio.toString());
    formData.append('categoria', categoriaValue);
    formData.append('stock', formValues.stock.toString());
    formData.append('estado', formValues.estado.toString());
    
    // Agregar mercado solo si tiene valor
    if (formValues.mercado && formValues.mercado.trim() !== '') {
      formData.append('mercado', formValues.mercado);
    }
    
    // Agregar la imagen si se seleccionó una nueva
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
      console.log('📤 Agregando nueva imagen:', this.selectedFile.name);
    }

    console.log('📤 Datos a enviar:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    });

    // Llamar al servicio para actualizar producto
    this.productoService.updateProductoFormData(this.productoId, formData).subscribe({
      next: (response: any) => {
        console.log('✅ Producto actualizado:', response);
        this.isLoading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message || 'Producto actualizado correctamente',
          life: 3000
        });
        
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('❌ Error al actualizar producto:', error);
        this.isLoading = false;
        
        let errorMessage = `Error al actualizar el producto: ${error.message || 'Error desconocido'}`;
        
        // Mostrar errores específicos del backend si existen
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          const errorDetails = Object.keys(errors)
            .map(key => `${key}: ${errors[key]}`)
            .join(', ');
          errorMessage = `Errores de validación: ${errorDetails}`;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.errorMessage = errorMessage;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }

  get nombre() { return this.productoForm.get('nombre'); }
  get descripcion() { return this.productoForm.get('descripcion'); }
  get precio() { return this.productoForm.get('precio'); }
  get categoria() { return this.productoForm.get('categoria'); }
  get stock() { return this.productoForm.get('stock'); }
  get mercado() { return this.productoForm.get('mercado'); }
  get estado() { return this.productoForm.get('estado'); }
}