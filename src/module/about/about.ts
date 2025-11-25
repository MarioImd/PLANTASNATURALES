import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-about',
  imports: [ButtonModule, CardModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  constructor(private router: Router) { }

  navigateToProducts() {
    this.router.navigate(['/productos']);
  }

}
