import { Routes } from '@angular/router';
import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Menu } from './components/menu/menu';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'menu', component: Menu },
  { path: 'home', component: App }
];