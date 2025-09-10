import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonLabel, 
  IonImg, 
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonLabel, 
    IonImg,
    IonGrid,
    IonRow,
    IonCol
  ],
  templateUrl: './menu.html',
  styleUrls: []
})
export class Menu {

}
