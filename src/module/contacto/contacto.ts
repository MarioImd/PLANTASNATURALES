import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  imports: [],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  constructor() {
    // Make copyEmail function available globally for onclick handlers
    (window as any).copyEmail = this.copyEmail.bind(this);
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.textContent = '✓ Correo copiado al portapapeles';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar el correo:', err);
    });
  }
}
