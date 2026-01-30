import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: '', component:Home },
    {path: 'register', component:Register },
    {path: 'login', component:Login },
    
];
