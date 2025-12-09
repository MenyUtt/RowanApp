import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { 
  IonContent, IonList, IonItem, 
  IonLabel, IonInput, IonButton, IonImg, LoadingController, ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonList, IonItem, // IonCard y IonCardContent eliminados
    IonLabel, IonInput, IonButton, IonImg
  ],
  templateUrl: './verification.html',
  styles: [`
    .verification-page {
      --background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .main-container {
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
    }
    .top-logo-container ion-img {
      width: 100px;
      margin-top: 50px;
    }
    .form-card-container {
      width: 100%;
      border: 3px solid #e70043;
      border-radius: 30px;
      padding: 40px 20px;
      background: #fff;
      margin-top: 20px;
      text-align: center;
    }
    .login-button {
      --background: #6fbb3d;
      --border-radius: 20px;
      margin-top: 20px;
      font-weight: 600;
    }
    .letter-spacing-input {
      letter-spacing: 5px;
      font-size: 1.2em;
      font-weight: bold;
    }
  `]
})
export class Verification implements OnInit {
  userId: number | null = null;
  twoFactorCode: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
    } else {
      this.presentToast('Error: No se identificó al usuario.', 'danger');
      this.router.navigate(['/login']);
    }
  }

  // Corregido nombre del método para coincidir con el HTML (verifyCode)
  async verifyCode() {
    if (!this.twoFactorCode || this.twoFactorCode.length !== 6) {
      this.presentToast('Código inválido', 'warning');
      return; 
    }
    
    if (!this.userId) return;

    let loading = await this.loadingCtrl.create({ message: 'Verificando código...' });
    await loading.present();

    try {
      // Corregido: usar authService y twoFactorCode en lugar de auth y code
      const res: any = await this.authService.verify2fa(this.userId, this.twoFactorCode).toPromise();

      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('currentUser', JSON.stringify(res.usuario));
      this.router.navigate(['/menu']);
      
    } catch (err) {
      this.presentToast('Código incorrecto o expirado.', 'danger');
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

  cancel() {
    this.router.navigate(['/login']);
  }
}