import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  private apiUrl = environment.apiUrl; 
  private router = inject(Router);

  constructor(private http: HttpClient) { }

  // === GESTIÓN DE SESIÓN (sessionStorage) ===

  // Guardar sesión (Usar sessionStorage para que expire al cerrar)
  saveSession(token: string, user: any) {
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Obtener usuario actual
  getUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Verificar si está logueado
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  // Cerrar sesión y borrar todo
  logout() {
    sessionStorage.clear();
    // replaceUrl: true evita que puedan volver atrás
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private getAuthOptions() {
    const token = sessionStorage.getItem('access_token'); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  // === TUS MÉTODOS HTTP EXISTENTES ===
  verify2fa(userId: number, code: string): Observable<any> {
    const body = { userId, code };
    return this.http.post(`${this.apiUrl}/auth/login-verify-2fa`, body);
  }

  setup2FA(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/2fa/setup`, this.getAuthOptions());
  }

  activate2FA(secret: string, token: string): Observable<any> {
    const body = { secret, token };
    return this.http.post(`${this.apiUrl}/auth/2fa/activate`, body, this.getAuthOptions());
  }

  disable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/2fa/disable`, {}, this.getAuthOptions());
  }
}