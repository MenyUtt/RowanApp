import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si YA tiene sesión, lo mandamos al menú y no dejamos ver el login
    router.navigate(['/menu'], { replaceUrl: true });
    return false;
  } else {
    return true; // Permitir ver login/register si no hay sesión
  }
};
