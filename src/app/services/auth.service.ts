import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// CORRECCIÓN 1: Se eliminó el ";" al final de esta línea
@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  // CORRECCIÓN 2: Se cambió 'apiBaseUrl' por 'apiUrl' para coincidir con environment.ts
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  // Función de utilidad para obtener las opciones de cabecera con el token JWT
  private getAuthOptions() {
    const token = localStorage.getItem('access_token'); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  // 1. Llama a POST /auth/login-verify-2fa (Verificación Login Paso 2)
  verify2fa(userId: number, code: string): Observable<any> {
    const body = { userId, code };
    return this.http.post(`${this.apiUrl}/auth/login-verify-2fa`, body);
  }

  // 2. Llama a GET /auth/2fa/setup (Solicita Secreto y QR)
  setup2FA(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/2fa/setup`, this.getAuthOptions());
  }

  // 3. Llama a POST /auth/2fa/activate (Activa permanentemente 2FA)
  activate2FA(secret: string, token: string): Observable<any> {
    const body = { secret, token };
    return this.http.post(`${this.apiUrl}/auth/2fa/activate`, body, this.getAuthOptions());
  }

  // 4. Llama a POST /auth/2fa/disable (Deshabilita 2FA)
  disable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/2fa/disable`, {}, this.getAuthOptions());
  }
}