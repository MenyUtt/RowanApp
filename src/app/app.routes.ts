import { Routes } from '@angular/router';
import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Menu } from './components/menu/menu';
import { Perfil } from './components/perfil/perfil'; 
import { Tickets } from './components/tickets/tickets'; 
import { Verification } from './components/verification/verification'; 
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  // Rutas PÚBLICAS (Solo accesibles si NO estás logueado)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    component: Login, 
    canActivate: [publicGuard] 
  },
  { 
    path: 'register', 
    component: Register,
    canActivate: [publicGuard] 
  },
  { 
    path: 'verification/:id', 
    component: Verification,
    canActivate: [publicGuard] // Aún no ha completado el login full
  }, 

  // Rutas PRIVADAS (Solo accesibles si ESTÁS logueado)
  { 
    path: 'menu', 
    component: Menu, 
    canActivate: [authGuard] 
  },
  { 
    path: 'tickets/:edificioId', 
    component: Tickets, 
    canActivate: [authGuard] 
  },
  { 
    path: 'perfil', 
    component: Perfil, 
    canActivate: [authGuard] 
  },
  { 
    path: 'home', 
    component: App, 
    canActivate: [authGuard] 
  }
];