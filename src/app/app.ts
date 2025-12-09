import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate } from '@angular/service-worker'; // <--- Importación necesaria

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class App implements OnInit { // <--- Implementar OnInit
  
  // Inyectamos SwUpdate en el constructor
  constructor(private swUpdate: SwUpdate) {
    addIcons({ logOutOutline });
  }

  protected readonly title = signal('RowanApp');

  ngOnInit() {
    // Lógica para detectar actualizaciones automáticamente
    if (this.swUpdate.isEnabled) {
      
      // 1. Suscribirse cuando el navegador detecta una nueva versión
      this.swUpdate.versionUpdates.subscribe((evt) => {
        if (evt.type === 'VERSION_READY') {
          // Preguntar al usuario si quiere actualizar
          if (confirm('Hay una nueva versión disponible. ¿Cargar ahora?')) {
            window.location.reload();
          }
        }
      });

      // 2. Opcional: Buscar actualizaciones cada cierto tiempo (ej. cada hora)
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 1000 * 60 * 60);
    }
  }
}