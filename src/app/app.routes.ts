import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { GetAllCategories } from './components/categories/get-all-categories/get-all-categories';
import { CategoriesForm } from './components/categories/categories-form/categories-form';

export const routes: Routes = [
    {path: '', component:Home },
    {path: 'register', component:Register },
    {path: 'login', component:Login },
    {path : 'categories', component:GetAllCategories},
    // {path : 'categories', component:CategoriesForm},
];
