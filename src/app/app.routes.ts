import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { GetAllCategories } from './components/categories/get-all-categories/get-all-categories';
import { GetAllDonors } from './components/donors/get-all-donors/get-all-donors';

export const routes: Routes = [
    {path: '', component:Home },
    {path: 'register', component:Register },
    {path: 'login', component:Login },
    {path : 'categories', component:GetAllCategories},
    {path : 'donors', component:GetAllDonors},
];
