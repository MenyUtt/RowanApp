import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, //IonCheckbox, 
  IonLabel, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: []
})
export class Register {
  userData = {
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    telefono: '',
    rol_id: 4 // Asumimos que el rol 'Cliente' o 'Usuario' tiene el ID 2. ¡Ajusta este valor si es necesario!
  };

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://192.168.100.72:3000/usuarios', this.userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        // Opcional: mostrar un mensaje de éxito al usuario
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Redirigir al login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        // Opcional: mostrar un mensaje de error detallado
        alert(`Error en el registro: ${error.error.message || 'Intenta de nuevo.'}`);
      }
    });
  }
}