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
  IonItem // Add this import
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
    IonItem // Add it to the imports array
  ],
  templateUrl: './perfil.html',
  styleUrls: []
})
export class Perfil {
  // You can manage profile information here
  profile = {
    name: 'Eder Eduardo Sanchez Valdez',
    role: 'Cliente',
    email: 'e.sanchez@cjf.com.mx'
  };
}