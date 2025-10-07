import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonLabel, 
  IonImg, 
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common'; // Ya no es necesario por ahora

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
    // CommonModule se ha quitado de aquí
  ],
  templateUrl: './menu.html',
  styleUrls: []
})
export class Menu implements OnInit {
  
  public edificios: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/edificios').subscribe({
      next: (data) => {
        this.edificios = data.slice(0, 5); 
      },
      error: (error) => {
        console.error('Error al cargar los edificios:', error);
      }
    });
  }
}