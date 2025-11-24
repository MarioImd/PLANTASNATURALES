import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { PrimengModule } from '../primng.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,PrimengModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto');
}
