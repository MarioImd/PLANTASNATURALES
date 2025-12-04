// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  nombre: string;
  email: string;
  estado: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  
  currentUser$ = this.currentUserSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const isAdminStr = localStorage.getItem('isAdmin');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      this.isAdminSubject.next(isAdminStr === 'true');
    }
  }
  
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login/`, {
      username,  // Cambiado de email a username
      password
    }).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('isAdmin', response.is_admin.toString());
          this.currentUserSubject.next(response.user);
          this.isAdminSubject.next(response.is_admin);
        }
      })
    );
  }
  
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}logout/`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAdmin');
        this.currentUserSubject.next(null);
        this.isAdminSubject.next(false);
      })
    );
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}