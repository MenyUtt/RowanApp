import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, IonLabel, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: []
})
export class Login {
  credentials = {
    correo: '',
    contrasena: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:3000/auth/login', this.credentials).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        // Guardamos los datos del usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.usuario));
        localStorage.setItem('access_token', response.access_token);
        
        this.router.navigate(['/menu']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    });
  }
}