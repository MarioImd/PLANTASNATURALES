import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto, ProductoFormData } from '../../../util/productos.interfaces';
import { Location } from '@angular/common';
import { ProductoService } from '../../../services/ProductosServices/productos.service';

@Component({
  selector: 'app-editar-producto',
  standalone: true, // Si estás usando componentes standalone
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  producto: Producto | null = null;
  isLoading = false;
  errorMessage = '';
  productoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService:ProductoService ,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.email]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      mercado: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productoId = +params['id'];
      if (this.productoId) {
        this.loadProducto(this.productoId);
      } else {
        this.errorMessage = 'ID de producto no válido';
      }
    });
  }

  loadProducto(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productoService.getProductoById(id).subscribe({
      next: (producto: Producto) => {
        this.producto = producto;
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          categoria: producto.categoria,
          stock: producto.stock,
          mercado: producto.mercado || ''
        });
        this.isLoading = false;
      },
      error: (error: { message: any; }) => {
        this.errorMessage = `Error al cargar el producto: ${error.message}`;
        this.isLoading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.invalid || !this.productoId) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData: ProductoFormData = this.productoForm.value;

    this.productoService.updateProducto(this.productoId, formData).subscribe({
      next: (updatedProducto: Producto) => {
        console.log('Producto actualizado:', updatedProducto);
        this.isLoading = false;
        
        alert('Producto actualizado correctamente');
        this.router.navigate(['/productos']);
      },
      error: (error: { message: any; }) => {
        this.errorMessage = `Error al actualizar el producto: ${error.message}`;
        this.isLoading = false;
        console.error('Error updating product:', error);
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
}