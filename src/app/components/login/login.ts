import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, IonCard, IonCardContent, IonList, IonItem, 
  IonInput, IonButton, IonImg, IonLabel
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, IonContent, IonCard, IonCardContent, IonList, 
    IonItem, IonInput, IonButton, IonImg, IonLabel,
    FormsModule, CommonModule, RecaptchaModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class Login {
  
  credentials = {
    correo: '',
    contrasena: ''
  };

  captchaToken: string = '';
  siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  constructor(private http: HttpClient, private router: Router) {}

  resolved(captchaResponse: string | null) {
    this.captchaToken = captchaResponse || '';
  }

  login() {
    if (!this.captchaToken) {
      alert('Por favor, resuelve el captcha.');
      return;
    }

    const payload = {
      ...this.credentials,
      recaptchaToken: this.captchaToken
    };

    this.http.post(`${environment.apiUrl}/auth/login-step1`, payload).subscribe({
      next: (response: any) => {
        if (response.require2fa) {
          console.log('Credenciales correctas. Redirigiendo a verificación.');
          this.router.navigate(['/verification', response.userId], { replaceUrl: true });
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(response.usuario));
            sessionStorage.setItem('access_token', response.access_token)
            this.router.navigate(['/menu'], { replaceUrl: true });
        }
      },
      error: (error) => {
        console.error('Error en credenciales:', error);
        alert('Credenciales incorrectas o error en el servidor.');
        this.captchaToken = ''; 
      }
    });
  }
}