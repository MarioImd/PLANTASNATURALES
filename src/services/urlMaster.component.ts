import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlMasterService {
  // Local / TESTER
backend: string = "http://127.0.0.1:8000/productos/";
  //backend: string = "https://ingenieria.sspechih.gob.mx/fideicomisos_api_test/";
  // Production / LIVE
  // backend: string = "https://ingenieria.sspechih.gob.mx/fidecomisos_api/";

  /**
   * Devuelve la URL para endpoints de API
   */
  getApiUrl(path: string): string {
    return `${this.backend}${path}`;
  }

  /**
   * Devuelve la URL para archivos media, quitando el sufijo /fidecomisos_api/ si existe
   */
  getMediaUrl(path: string): string {
    // Quita el slash inicial si existe
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    // Quita el sufijo /fidecomisos_api/ de backend si existe
    let base = this.backend;
    if (base.endsWith('/fidecomisos_api/') || base.endsWith('/fidecomisos_api')) {
      base = base.replace(/\/fidecomisos_api\/?$/, '/');
    }
    // Asegura que solo haya un slash entre base y path
    return `${base}${path}`;
  }
}
