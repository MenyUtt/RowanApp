import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonSearchbar, 
  IonSelect, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonImg,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.html'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonSearchbar, 
    IonSelect, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonImg,
    IonFab,
    IonFabButton
  ],
})
export class Tickets {
  constructor() {
    // Añadir el ícono de filtro para que esté disponible en el template
    addIcons({ filterOutline });
  }
  Tickets = {
    ID: '142589', 
    Fecha: '15/05/2025',
    Sistema: 'Accesos',
    Descripcion: 'Barrera Vehicular sin funciones',
    Asignado: 'Yoshep Emmanuel Garza Padilla',
    Edificio: 'SEDE',
    Status: 'Pendiente'
  };
}
