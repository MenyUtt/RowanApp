import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, IonContent, IonCard, IonCardContent, IonList, IonItem, IonInput, IonButton, IonImg, IonLabel],
  templateUrl: './login.html',
  styleUrls: []
})
export class Login {

}
