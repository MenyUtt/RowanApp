import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    IonItem
  ],
  templateUrl: './perfil.html',
  styleUrls: []
})
export class Perfil {
  // Ahora el nombre completo está en una sola línea
  profile = {
    name: 'Eder Eduardo Sanchez Valdez', 
    role: 'Cliente',
    email: 'e.sanchez@cjf.com.mx'
  };
}