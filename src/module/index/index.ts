import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-index',
  imports: [ButtonModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {


  buttonsexo() {
    console.log("sexo");
  }

}
