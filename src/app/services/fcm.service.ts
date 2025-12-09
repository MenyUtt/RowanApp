import { Injectable, inject, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface AppNotification {
  title: string;
  body: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private http = inject(HttpClient);
  private messaging: any;

  // === SIGNALS PARA EL ESTADO ===
  public notifications = signal<AppNotification[]>([]); // Lista de notificaciones
  public unreadCount = signal<number>(0); // Contador de no leídas

  constructor() {
    // 1. Inicializar Firebase
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  async initPush() {
    try {
      // 2. Pedir permiso al usuario
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Permiso de notificación denegado');
        return;
      }

      // 3. Obtener el Token Web
      const token = await getToken(this.messaging, {
        vapidKey: environment.vapidKey
      });
      
      console.log('Token FCM Web:', token);
      // 4. Guardar token en el Backend (si hay usuario logueado)
      this.saveTokenToBackend(token);

      // Escuchar mensajes en primer plano
      onMessage(this.messaging, (payload) => {
        console.log('Mensaje recibido:', payload);
        
        // 1. Crear el objeto de notificación
        const newNotif: AppNotification = {
          title: payload.notification?.title || 'Nueva notificación',
          body: payload.notification?.body || '',
          timestamp: new Date()
        };

        // 2. Actualizar los Signals (Agregar a la lista y subir contador)
        this.notifications.update(current => [newNotif, ...current]);
        this.unreadCount.update(count => count + 1);

        // Opcional: Vibrar el celular
        if (navigator.vibrate) navigator.vibrate(200);
      });

    } catch (error) {
      console.error('Error al inicializar FCM:', error);
    }
  }
  // Método para reiniciar el contador a 0
  resetBadge() {
    this.unreadCount.set(0);
  }

  private saveTokenToBackend(token: string) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      // Usamos el endpoint que creamos anteriormente
      this.http.put(`${environment.apiUrl}/usuarios/${user.id}/fcm-token`, { token }).subscribe({
        next: () => console.log('Token guardado en servidor'),
        error: (e) => console.error('Error guardando token', e)
      });
    }
  }
}