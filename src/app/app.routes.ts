import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { GetAllCategories } from './components/categories/get-all-categories/get-all-categories';
import { GetAllDonors } from './components/donors/get-all-donors/get-all-donors';
import { GetAllGifts } from './components/gifts/get-all-gifts/get-all-gifts';
import { Basket } from './components/basket/basket';
import { PurchaseListComponent } from './components/purchases/purchase-list/purchase-list';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'categories', component: GetAllCategories },
    { path: 'donors', component: GetAllDonors },
    { path: 'gifts/:categoryId', component: GetAllGifts },
    { path: 'gifts', component: GetAllGifts },
    { path: 'basket', component: Basket },
    { path: 'purchases', component: PurchaseListComponent }
];
