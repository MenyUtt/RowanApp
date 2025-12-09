import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { 
  IonContent, IonCard, IonCardContent, IonLabel, IonImg, IonGrid, IonRow, IonCol,
  IonButton, IonIcon, IonBadge, IonPopover, IonList, IonItem, IonText
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common'; // <--- AGREGAR ESTO PARA EL PIPE UPPERCASE
import { FcmService } from '../../services/fcm.service';
import { addIcons } from 'ionicons'; // <--- Para usar iconos de ionic
import { notificationsOutline, notifications } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent, IonCard, IonCardContent, IonLabel, IonImg, IonGrid, IonRow, IonCol,
    IonButton, IonIcon, IonBadge, IonPopover, IonList, IonItem, IonText
  ],
  templateUrl: './menu.html',
  styleUrls: []
})
export class Menu implements OnInit {
  
  public edificios: any[] = [];
  public fcmService = inject(FcmService);

  constructor(private http: HttpClient) {
    addIcons({ notificationsOutline, notifications });
  }

  ngOnInit() {
    this.fcmService.initPush();
    // Solicitamos los edificios al backend
    this.http.get<any[]>(`${environment.apiUrl}/edificios`).subscribe({
      next: (data) => {
        // Guardamos TODOS los edificios que traiga la base de datos
        // Asegúrate de que en tu BD los IDs sean 1, 2, 3, 4, 5, 6
        this.edificios = data; 
      },
      error: (error) => {
        console.error('Error al cargar los edificios:', error);
      }
    });
  }
  onOpenNotifications() {
    // Reiniciamos el contador a 0
    this.fcmService.resetBadge();
  }
}