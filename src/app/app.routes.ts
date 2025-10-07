import { Routes } from '@angular/router';
import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Menu } from './components/menu/menu';
import { Perfil } from './components/perfil/perfil'; 
import { Tickets } from './components/tickets/tickets'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'menu', component: Menu },
  { path: 'tickets/:edificioId', component: Tickets },
  { path: 'perfil', component: Perfil },
  { path: 'home', component: App }
];