import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonLabel, IonImg, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonLabel, IonImg, IonMenuButton],
  templateUrl: './menu.html',
  styleUrls: []
})
export class Menu {

}
