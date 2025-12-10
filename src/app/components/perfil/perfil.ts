import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, // <--- Agregado
  IonCardTitle,  // <--- Agregado
  IonImg, 
  IonLabel, 
  IonButton,
  IonItem,
  IonInput,      // <--- Agregado
  LoadingController, 
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonCard, 
    IonCardContent,
    IonCardHeader, // <--- Agregado
    IonCardTitle,  // <--- Agregado
    IonImg, 
    IonLabel, 
    IonButton,
    IonItem,
    IonInput,      // <--- Agregado
    CommonModule,
    FormsModule    // Asegúrate de que esto esté aquí para el ngModel
  ],
  templateUrl: './perfil.html',
  styleUrls: []
})
export class Perfil implements OnInit { 
  
  profile: any = {};
  is2FAEnabled: boolean = false; 
  showQRSetup: boolean = false;
  qrCodeDataURL: string | null = null;
  secretKey: string | null = null;
  verificationCode: string = '';

  private router = inject(Router);
  private authService = inject(AuthService); 
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  ngOnInit() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      this.profile = {
        ...userData,
        name: `${userData.nombre} ${userData.apellidos}`
      };
      this.is2FAEnabled = !!userData.esDosFactoresHabilitado;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
  }

  async start2FASetup() {
    let loading = await this.loadingCtrl.create({ message: 'Generando código QR...' });
    await loading.present();

    try {
      const response = await this.authService.setup2FA().toPromise();
      this.secretKey = response.secret;
      this.qrCodeDataURL = response.qrCodeDataURL;
      this.showQRSetup = true;
    } catch (error) {
      this.presentToast('Error al iniciar 2FA. Intente de nuevo.', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async activate2FA() {
    if (this.verificationCode.length !== 6 || !this.secretKey) {
      this.presentToast('Ingrese un código de 6 dígitos válido.', 'warning');
      return;
    }

    let loading = await this.loadingCtrl.create({ message: 'Activando 2FA...' });
    await loading.present();

    try {
      await this.authService.activate2FA(this.secretKey, this.verificationCode).toPromise();
      this.is2FAEnabled = true; 
      this.showQRSetup = false;
      this.qrCodeDataURL = null;
      this.verificationCode = '';
      this.updateLocalStorage(true);
      this.presentToast('Autenticación de dos factores activada con éxito.', 'success');
    } catch (error) {
      this.presentToast('Código inválido. Verifique su aplicación de autenticación.', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async disable2FA() {
    if (!this.is2FAEnabled) return;

    let loading = await this.loadingCtrl.create({ message: 'Desactivando 2FA...' });
    await loading.present();

    try {
      await this.authService.disable2FA().toPromise();
      this.is2FAEnabled = false; 
      this.updateLocalStorage(false);
      this.presentToast('Autenticación de dos factores deshabilitada.', 'success');
    } catch (error) {
      this.presentToast('Error al deshabilitar 2FA.', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
  async presentToast(message: string, cssClass: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: cssClass
    });
    await toast.present();
  }
  private updateLocalStorage(isEnabled: boolean) {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      userData.esDosFactoresHabilitado = isEnabled; 
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }
  }
}