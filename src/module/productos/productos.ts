import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-productos',
  imports: [ButtonModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {

}
