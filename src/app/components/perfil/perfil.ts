import { Component, OnInit } from '@angular/core'; // 1. Importa OnInit
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonCard, 
  IonCardContent, 
  IonImg, 
  IonLabel, 
  IonButton,
  IonItem
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonCard, 
    IonCardContent, 
    IonImg, 
    IonLabel, 
    IonButton,
    IonItem,
    CommonModule // Añade CommonModule
  ],
  templateUrl: './perfil.html',
  styleUrls: []
})
export class Perfil implements OnInit { // 2. Implementa OnInit
  
  // 3. Inicializa profile como un objeto vacío
  profile: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    // 4. Carga los datos del usuario desde localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      // Combina nombre y apellidos para el nombre completo
      this.profile = {
        ...userData,
        name: `${userData.nombre} ${userData.apellidos}`
      };
    } else {
      // Si no hay datos, redirige al login
      this.router.navigate(['/login']);
    }
  }

  logout() {
    // 5. Limpia localStorage al cerrar sesión
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}