import { Routes } from '@angular/router';
import { Index } from '../module/index';
import { About } from '../module/about/about';
import { Productos } from '../module/productos/productos';
import { Plantas } from '../module/productos/plantas/plantas';
import { Accesorios } from '../module/productos/accesorios/accesorios';
import { Veterinaria } from '../module/productos/veterinaria/veterinaria';
import { PuntosVenta } from '../module/puntos-venta/puntos-venta';
import { Contacto } from '../module/contacto/contacto';
import { AgregarProductoComponent } from '../module/productos/agregar_Producto/agregar_producto.component';

export const routes: Routes = [
  { path: '', component: Index },
  { path: 'about', component: About },
  { path: 'productos', component: Productos },
  { path: 'plantas', component: Plantas },
  { path: 'accesorios', component: Accesorios },
  { path: 'veterinaria', component: Veterinaria },
  { path: 'puntos-venta', component: PuntosVenta },
  { path: 'contacto', component: Contacto },
    {
    path: 'productos/agregar',
    component: AgregarProductoComponent
  },
];
